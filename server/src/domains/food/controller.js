import prisma from "../../shared/prismaClient.js";

const getLatestWaterLevel = async (req, res) => {
  try {
    const latestReading = await prisma.sensorReading.findFirst({
      where: { sensorType: "WATER_LEVEL" },
      orderBy: { recordedAt: "desc" },
    });

    if (!latestReading) {
      return res.status(404).json({
        message: "No water level readings found.",
      });
    }

    res.status(200).json({
      message: "Latest water level reading retrieved successfully.",
      data: latestReading,
    });
  } catch (error) {
    console.error("Error in getLatestWaterLevel controller:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const getAllWaterLevels = async (req, res) => {
  try {
    const allReadings = await prisma.sensorReading.findMany({
      where: { sensorType: "WATER_LEVEL" },
      orderBy: { recordedAt: "desc" },
    });

    if (allReadings.length === 0) {
      return res.status(404).json({
        message: "No water level readings found.",
      });
    }

    res.status(200).json({
      message: "All water level readings retrieved successfully.",
      data: allReadings,
    });
  } catch (error) {
    console.error("Error in getAllWaterLevels controller:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const getWaterLevelHistory = async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - parseInt(hours));

    const readings = await prisma.sensorReading.findMany({
      where: {
        sensorType: "WATER_LEVEL",
        recordedAt: { gte: startTime },
      },
      orderBy: { recordedAt: "asc" },
      take: 1000,
    });

    res.status(200).json({
      message: `Water level history for last ${hours} hours retrieved successfully.`,
      data: readings,
      summary: {
        count: readings.length,
        timeRange: `${hours} hours`,
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in getWaterLevelHistory controller:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const getAquaponicsStats = async (req, res) => {
  try {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const latest = await prisma.sensorReading.findFirst({
      where: { sensorType: "WATER_LEVEL" },
      orderBy: { recordedAt: "desc" },
    });

    const recentReadings = await prisma.sensorReading.findMany({
      where: {
        sensorType: "WATER_LEVEL",
        recordedAt: { gte: last24Hours },
      },
      orderBy: { recordedAt: "desc" },
      take: 1000,
    });

    let stats = {};
    if (recentReadings.length > 0) {
      const values = recentReadings.map((r) => r.value);
      stats = {
        min_level: Math.min(...values),
        max_level: Math.max(...values),
        avg_level: values.reduce((a, b) => a + b, 0) / values.length,
        reading_count: values.length,
      };
    }

    res.status(200).json({
      message: "Aquaponics statistics retrieved successfully.",
      data: {
        current: latest,
        last24Hours: stats,
        status: latest
          ? latest.value < 20
            ? "low"
            : latest.value > 140
              ? "high"
              : "normal"
          : "unknown",
      },
    });
  } catch (error) {
    console.error("Error in getAquaponicsStats controller:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export {
  getLatestWaterLevel,
  getAllWaterLevels,
  getWaterLevelHistory,
  getAquaponicsStats,
};
