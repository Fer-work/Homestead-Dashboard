// Quick database test to see what's causing the hang
import AquaponicsReading from "./models/AquaponicsReading.js";
import { connectToDatabase } from "./config/connection.js";

async function testDatabase() {
  try {
    console.log("Connecting to database...");
    await connectToDatabase();
    
    console.log("Testing basic query...");
    const count = await AquaponicsReading.count();
    console.log(`Total readings in database: ${count}`);
    
    if (count > 0) {
      console.log("Getting latest reading...");
      const latest = await AquaponicsReading.findOne({
        order: [["created_at", "DESC"]]
      });
      console.log("Latest reading:", JSON.stringify(latest, null, 2));
      
      console.log("Testing specific sensor query...");
      const sensorReading = await AquaponicsReading.findOne({
        where: { sensor_id: "water_level_sump" },
        order: [["created_at", "DESC"]]
      });
      console.log("Sensor reading:", JSON.stringify(sensorReading, null, 2));
    }
    
    console.log("Database test completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Database test failed:", error);
    process.exit(1);
  }
}

testDatabase();