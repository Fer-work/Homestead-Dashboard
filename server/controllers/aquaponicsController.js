// controllers/aquaponicsController.js

// Correctly import the default export from the model file
import AquaponicsReading from "../models/AquaponicsReading.js";
import { Op, fn, col } from "sequelize";
import sequelize from "../config/connection.js";

const getLatestWaterLevel = async (req, res) => {
  try {
    const sensorId = "water_level_sump";

    // Use the model's .findOne() method directly
    const latestReading = await AquaponicsReading.findOne({
      where: { sensor_id: sensorId },
      order: [["created_at", "DESC"]],
    });

    if (!latestReading) {
      return res.status(404).json({
        message: "No water level readings found for the specified sensor.",
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
    const sensorId = "water_level_sump";

    // Use the model's .findAll() method directly
    const allReadings = await AquaponicsReading.findAll({
      where: { sensor_id: sensorId },
      order: [["created_at", "DESC"]],
    });

    if (!allReadings || allReadings.length === 0) {
      return res.status(404).json({
        message: "No water level readings found for the specified sensor.",
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
    const sensorId = "water_level_sump";
    const { hours = 24 } = req.query;
    
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - parseInt(hours));

    const readings = await AquaponicsReading.findAll({
      where: { 
        sensor_id: sensorId,
        created_at: {
          [Op.gte]: startTime
        }
      },
      order: [["created_at", "ASC"]],
      limit: 1000
    });

    res.status(200).json({
      message: `Water level history for last ${hours} hours retrieved successfully.`,
      data: readings,
      summary: {
        count: readings.length,
        timeRange: `${hours} hours`,
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error in getWaterLevelHistory controller:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const getAquaponicsStats = async (req, res) => {
  try {
    const sensorId = "water_level_sump";
    
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    // Get latest reading
    const latest = await AquaponicsReading.findOne({
      where: { sensor_id: sensorId },
      order: [["created_at", "DESC"]]
    });

    // Get recent readings for basic stats
    const recentReadings = await AquaponicsReading.findAll({
      where: { 
        sensor_id: sensorId,
        created_at: {
          [Op.gte]: last24Hours
        }
      },
      order: [["created_at", "DESC"]],
      limit: 1000
    });

    // Calculate stats manually
    let stats = {};
    if (recentReadings.length > 0) {
      const values = recentReadings.map(r => parseFloat(r.numeric_value));
      stats = {
        min_level: Math.min(...values),
        max_level: Math.max(...values),
        avg_level: values.reduce((a, b) => a + b, 0) / values.length,
        reading_count: values.length
      };
    }

    res.status(200).json({
      message: "Aquaponics statistics retrieved successfully.",
      data: {
        current: latest,
        last24Hours: stats,
        status: latest ? (
          parseFloat(latest.numeric_value) < 20 ? 'low' : 
          parseFloat(latest.numeric_value) > 140 ? 'high' : 'normal'
        ) : 'unknown'
      }
    });
  } catch (error) {
    console.error("Error in getAquaponicsStats controller:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export { getLatestWaterLevel, getAllWaterLevels, getWaterLevelHistory, getAquaponicsStats };
