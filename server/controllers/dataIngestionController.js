// controllers/dataIngestionController.js

// Correctly import the default export from the model file
import AquaponicsReading from "../models/AquaponicsReading.js";

const ingestReading = async (req, res) => {
  const { sensorId, type, valueCm } = req.body;

  if (!sensorId || !type || valueCm === undefined) {
    return res.status(400).json({
      error:
        "Missing required fields: sensorId, type, and valueCm are required.",
    });
  }

  if (typeof valueCm !== "number") {
    return res
      .status(400)
      .json({ error: "Invalid data type: valueCm must be a number." });
  }

  try {
    // Use the model's .create() method directly
    const newReading = await AquaponicsReading.create({
      sensor_id: sensorId,
      type: type,
      numeric_value: valueCm,
      unit: "cm",
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
