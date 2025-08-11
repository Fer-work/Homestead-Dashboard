// controllers/aquaponicsController.js

// Correctly import the default export from the model file
import AquaponicsReading from "../models/AquaponicsReading.js";

const getLatestWaterLevel = async (req, res) => {
  try {
    const sensorId = "water_level_sump";

    // Use the model's .findOne() method directly
    const latestReading = await AquaponicsReading.findOne({
      where: { sensor_id: sensorId },
      order: [["created_at", "DESC"]],
    });

    if (!latestReading) {
      return res
        .status(404)
        .json({
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

export { getLatestWaterLevel };
