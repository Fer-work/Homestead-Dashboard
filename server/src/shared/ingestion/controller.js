import prisma from "../prismaClient.js";

const ingestReading = async (req, res) => {
  const { sensorId, type, valueCm, deviceId, recordedAt } = req.body;

  // Support both legacy format (sensorId/type/valueCm) and new format (deviceId)
  if (!deviceId && (!sensorId || !type || valueCm === undefined)) {
    return res.status(400).json({
      error:
        "Missing required fields: provide deviceId with value, or legacy sensorId/type/valueCm.",
    });
  }

  if (valueCm !== undefined && typeof valueCm !== "number") {
    return res
      .status(400)
      .json({ error: "Invalid data type: valueCm must be a number." });
  }

  try {
    // If deviceId is provided directly, use it.
    // Otherwise, find or create a device for the legacy sensorId.
    let resolvedDeviceId = deviceId;

    if (!resolvedDeviceId) {
      // Legacy ingestion path: find device by name matching the sensorId
      let device = await prisma.device.findFirst({
        where: { name: sensorId },
      });

      if (!device) {
        // Auto-create a zone and device for legacy sensors
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

      resolvedDeviceId = device.id;
    }

    const newReading = await prisma.sensorReading.create({
      data: {
        deviceId: resolvedDeviceId,
        sensorType: "WATER_LEVEL",
        value: valueCm,
        unit: "cm",
        recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      },
    });

    res.status(201).json({
      message: "Reading ingested successfully.",
      data: newReading,
    });
  } catch (error) {
    console.error("Error in ingestReading controller:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export { ingestReading };
