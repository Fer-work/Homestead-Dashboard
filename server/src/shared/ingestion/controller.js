import prisma from "../prismaClient.js";
import { evaluateAlertRules } from "../alerts/engine.js";

const VALID_SENSOR_TYPES = [
  "PH", "TEMPERATURE", "WATER_LEVEL", "HUMIDITY", "DISSOLVED_OXYGEN",
  "EC_TDS", "VOLTAGE", "CURRENT", "POWER", "ENERGY", "GAS_PRESSURE",
  "GAS_FLOW", "WIND_SPEED", "WIND_DIRECTION", "LIGHT_LEVEL",
  "SOIL_MOISTURE", "CO2", "MOTION", "VIBRATION", "WEIGHT",
];

/**
 * Resolve device by macAddress — find existing or auto-create.
 */
const resolveDeviceByMac = async (macAddress) => {
  let device = await prisma.device.findUnique({
    where: { macAddress },
  });

  if (!device) {
    // Auto-create zone + device
    let zone = await prisma.zone.findFirst({
      where: { name: "Auto-registered" },
    });

    if (!zone) {
      zone = await prisma.zone.create({
        data: { name: "Auto-registered", domain: "ENERGY" },
      });
    }

    const last6 = macAddress.replace(/:/g, "").slice(-6).toUpperCase();

    device = await prisma.device.create({
      data: {
        name: `ESP32-${last6}`,
        deviceType: "SENSOR",
        macAddress,
        zoneId: zone.id,
      },
    });
  }

  return device;
};

/**
 * Resolve device for legacy format (sensorId-based).
 */
const resolveDeviceLegacy = async (sensorId) => {
  let device = await prisma.device.findFirst({
    where: { name: sensorId },
  });

  if (!device) {
    let zone = await prisma.zone.findFirst({
      where: { name: "Aquaponics (Legacy)" },
    });

    if (!zone) {
      zone = await prisma.zone.create({
        data: { name: "Aquaponics (Legacy)", domain: "FOOD" },
      });
    }

    device = await prisma.device.create({
      data: {
        name: sensorId,
        deviceType: "SENSOR",
        zoneId: zone.id,
      },
    });
  }

  return device;
};

/**
 * POST /api/ingest/reading
 * Accepts new format (macAddress) or legacy format (sensorId).
 */
const ingestReading = async (req, res) => {
  const { macAddress, sensorType, value, unit, recordedAt, metadata } = req.body;
  const { sensorId, type, valueCm, deviceId } = req.body;

  // Detect format
  const isNewFormat = !!macAddress;
  const isLegacyFormat = !!sensorId || !!deviceId;

  if (!isNewFormat && !isLegacyFormat) {
    return res.status(400).json({
      error: "Provide macAddress (new format) or sensorId/deviceId (legacy format).",
    });
  }

  try {
    let device;
    let readingData;

    if (isNewFormat) {
      // New ESP32 format
      if (!sensorType || value === undefined || !unit) {
        return res.status(400).json({
          error: "New format requires: macAddress, sensorType, value, unit.",
        });
      }

      if (!VALID_SENSOR_TYPES.includes(sensorType)) {
        return res.status(400).json({
          error: `Invalid sensorType. Must be one of: ${VALID_SENSOR_TYPES.join(", ")}`,
        });
      }

      if (typeof value !== "number") {
        return res.status(400).json({ error: "value must be a number." });
      }

      device = await resolveDeviceByMac(macAddress);

      readingData = {
        deviceId: device.id,
        sensorType,
        value,
        unit,
        recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
        metadata: metadata || undefined,
      };
    } else {
      // Legacy format
      if (!deviceId && (!sensorId || !type || valueCm === undefined)) {
        return res.status(400).json({
          error: "Legacy format requires: sensorId + type + valueCm, or deviceId.",
        });
      }

      if (valueCm !== undefined && typeof valueCm !== "number") {
        return res.status(400).json({ error: "valueCm must be a number." });
      }

      let resolvedDeviceId = deviceId;

      if (!resolvedDeviceId) {
        device = await resolveDeviceLegacy(sensorId);
        resolvedDeviceId = device.id;
      } else {
        device = await prisma.device.findUnique({ where: { id: resolvedDeviceId } });
      }

      readingData = {
        deviceId: resolvedDeviceId,
        sensorType: "WATER_LEVEL",
        value: valueCm,
        unit: "cm",
        recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      };
    }

    // Update device lastSeenAt
    await prisma.device.update({
      where: { id: readingData.deviceId },
      data: { lastSeenAt: new Date() },
    });

    // Create the reading
    const newReading = await prisma.sensorReading.create({
      data: readingData,
    });

    // Evaluate alert rules
    const triggeredAlerts = await evaluateAlertRules(newReading, device);

    res.status(201).json({
      message: "Reading ingested successfully.",
      data: newReading,
      alerts: triggeredAlerts.length > 0 ? triggeredAlerts : undefined,
    });
  } catch (error) {
    console.error("Error in ingestReading:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

/**
 * POST /api/ingest/readings
 * Batch ingestion — max 100 readings per request.
 */
const ingestReadings = async (req, res) => {
  const { readings } = req.body;

  if (!Array.isArray(readings) || readings.length === 0) {
    return res.status(400).json({ error: "readings must be a non-empty array." });
  }

  if (readings.length > 100) {
    return res.status(400).json({ error: "Maximum 100 readings per batch." });
  }

  try {
    const results = await prisma.$transaction(async (tx) => {
      const created = [];

      for (const r of readings) {
        if (!r.macAddress || !r.sensorType || r.value === undefined || !r.unit) {
          throw new Error(
            `Invalid reading: macAddress, sensorType, value, unit required. Got: ${JSON.stringify(r)}`
          );
        }

        if (!VALID_SENSOR_TYPES.includes(r.sensorType)) {
          throw new Error(`Invalid sensorType: ${r.sensorType}`);
        }

        // Resolve device
        let device = await tx.device.findUnique({
          where: { macAddress: r.macAddress },
        });

        if (!device) {
          let zone = await tx.zone.findFirst({
            where: { name: "Auto-registered" },
          });

          if (!zone) {
            zone = await tx.zone.create({
              data: { name: "Auto-registered", domain: "ENERGY" },
            });
          }

          const last6 = r.macAddress.replace(/:/g, "").slice(-6).toUpperCase();

          device = await tx.device.create({
            data: {
              name: `ESP32-${last6}`,
              deviceType: "SENSOR",
              macAddress: r.macAddress,
              zoneId: zone.id,
            },
          });
        }

        // Update lastSeenAt
        await tx.device.update({
          where: { id: device.id },
          data: { lastSeenAt: new Date() },
        });

        const reading = await tx.sensorReading.create({
          data: {
            deviceId: device.id,
            sensorType: r.sensorType,
            value: r.value,
            unit: r.unit,
            recordedAt: r.recordedAt ? new Date(r.recordedAt) : new Date(),
            metadata: r.metadata || undefined,
          },
        });

        created.push(reading);
      }

      return created;
    });

    // Evaluate alerts outside transaction for each reading
    for (const reading of results) {
      const device = await prisma.device.findUnique({ where: { id: reading.deviceId } });
      await evaluateAlertRules(reading, device);
    }

    res.status(201).json({
      message: `${results.length} readings ingested successfully.`,
      data: results,
    });
  } catch (error) {
    console.error("Error in ingestReadings:", error);
    res.status(400).json({ error: error.message });
  }
};

export { ingestReading, ingestReadings };
