// Simple test server without database
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

// Basic middleware
app.use(express.json());
app.use(cors());

// Test routes
app.get("/api/health", (req, res) => {
  res.json({ status: "Server working!" });
});

app.get("/api/aquaponics/waterlevel/latest", (req, res) => {
  res.json({
    message: "Test endpoint working",
    data: {
      id: 42,
      sensor_id: "water_level_sump",
      type: "ultrasonic",
      numeric_value: "143.93",
      unit: "cm",
      created_at: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`Simple test server listening on http://localhost:${PORT}`);
});