import prisma from "../../shared/prismaClient.js";

// ── Solar Arrays ────────────────────────────────────────────

const getSolarArrays = async (req, res) => {
  try {
    const arrays = await prisma.solarArray.findMany({
      include: { zone: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ message: "Solar arrays retrieved.", data: arrays });
  } catch (error) {
    console.error("Error in getSolarArrays:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const getSolarArray = async (req, res) => {
  try {
    const array = await prisma.solarArray.findUnique({
      where: { id: req.params.id },
      include: { zone: { select: { id: true, name: true } } },
    });
    if (!array) return res.status(404).json({ message: "Solar array not found." });
    res.status(200).json({ message: "Solar array retrieved.", data: array });
  } catch (error) {
    console.error("Error in getSolarArray:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const createSolarArray = async (req, res) => {
  try {
    const { name, zoneId, panelCount, panelWattage, totalWattage, mpptModel, tiltAngle, azimuth, installDate, notes } = req.body;
    const array = await prisma.solarArray.create({
      data: { name, zoneId, panelCount, panelWattage, totalWattage, mpptModel, tiltAngle, azimuth, installDate: installDate ? new Date(installDate) : null, notes },
    });
    res.status(201).json({ message: "Solar array created.", data: array });
  } catch (error) {
    console.error("Error in createSolarArray:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const updateSolarArray = async (req, res) => {
  try {
    const array = await prisma.solarArray.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json({ message: "Solar array updated.", data: array });
  } catch (error) {
    console.error("Error in updateSolarArray:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

// ── Battery Banks ───────────────────────────────────────────

const getBatteryBanks = async (req, res) => {
  try {
    const banks = await prisma.batteryBank.findMany({
      include: { zone: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ message: "Battery banks retrieved.", data: banks });
  } catch (error) {
    console.error("Error in getBatteryBanks:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const getBatteryBank = async (req, res) => {
  try {
    const bank = await prisma.batteryBank.findUnique({
      where: { id: req.params.id },
      include: { zone: { select: { id: true, name: true } } },
    });
    if (!bank) return res.status(404).json({ message: "Battery bank not found." });
    res.status(200).json({ message: "Battery bank retrieved.", data: bank });
  } catch (error) {
    console.error("Error in getBatteryBank:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const createBatteryBank = async (req, res) => {
  try {
    const { name, zoneId, chemistry, cellCount, nominalVoltage, capacityAh, capacityWh, maxCycles, installDate, notes } = req.body;
    const bank = await prisma.batteryBank.create({
      data: { name, zoneId, chemistry, cellCount, nominalVoltage, capacityAh, capacityWh, maxCycles, installDate: installDate ? new Date(installDate) : null, notes },
    });
    res.status(201).json({ message: "Battery bank created.", data: bank });
  } catch (error) {
    console.error("Error in createBatteryBank:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const updateBatteryBank = async (req, res) => {
  try {
    const bank = await prisma.batteryBank.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json({ message: "Battery bank updated.", data: bank });
  } catch (error) {
    console.error("Error in updateBatteryBank:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

// ── Energy Readings ─────────────────────────────────────────

const getEnergyReadings = async (req, res) => {
  try {
    const { hours = 24, deviceId } = req.query;
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - parseInt(hours));

    const where = {
      sensorType: { in: ["VOLTAGE", "CURRENT", "POWER", "ENERGY"] },
      recordedAt: { gte: startTime },
    };
    if (deviceId) where.deviceId = deviceId;

    const readings = await prisma.sensorReading.findMany({
      where,
      orderBy: { recordedAt: "asc" },
      take: 2000,
      include: { device: { select: { id: true, name: true } } },
    });

    res.status(200).json({
      message: `Energy readings for last ${hours} hours retrieved.`,
      data: readings,
      summary: { count: readings.length, timeRange: `${hours} hours` },
    });
  } catch (error) {
    console.error("Error in getEnergyReadings:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

// ── Energy Stats ────────────────────────────────────────────

const getEnergyStats = async (req, res) => {
  try {
    const [latestPower, latestVoltage, solarCount, batteryCount] = await Promise.all([
      prisma.sensorReading.findMany({
        where: { sensorType: "POWER" },
        orderBy: { recordedAt: "desc" },
        take: 10,
        include: { device: { select: { id: true, name: true } } },
      }),
      prisma.sensorReading.findMany({
        where: { sensorType: "VOLTAGE" },
        orderBy: { recordedAt: "desc" },
        take: 10,
        include: { device: { select: { id: true, name: true } } },
      }),
      prisma.solarArray.count(),
      prisma.batteryBank.count(),
    ]);

    const totalPower = latestPower.reduce((sum, r) => sum + r.value, 0);
    const avgVoltage = latestVoltage.length > 0
      ? latestVoltage.reduce((sum, r) => sum + r.value, 0) / latestVoltage.length
      : 0;

    res.status(200).json({
      message: "Energy stats retrieved.",
      data: {
        totalPowerW: totalPower,
        avgVoltage,
        solarArrayCount: solarCount,
        batteryBankCount: batteryCount,
        latestPowerReadings: latestPower,
        latestVoltageReadings: latestVoltage,
      },
    });
  } catch (error) {
    console.error("Error in getEnergyStats:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export {
  getSolarArrays,
  getSolarArray,
  createSolarArray,
  updateSolarArray,
  getBatteryBanks,
  getBatteryBank,
  createBatteryBank,
  updateBatteryBank,
  getEnergyReadings,
  getEnergyStats,
};
