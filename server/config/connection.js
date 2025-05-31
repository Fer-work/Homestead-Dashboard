import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Ensure .env variables are loaded

// It's better to ensure the MONGODB_URI includes the database name.
// Example: "mongodb+srv://user:pass@cluster.id.mongodb.net/Homestead?retryWrites=true&w=majority"
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/Homestead";

// Mongoose connection options
const mongooseOptions = {
  serverApi: {
    version: mongoose.mongo.ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(uri, mongooseOptions);
    console.log(
      `Successfully connected to MongoDB database using Mongoose. Target URI implies database: ${mongoose.connection.name}`
    ); // mongoose.connection.name will show the actual DB name.

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from MongoDB");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log(
        "Mongoose connection disconnected due to app termination (SIGINT)"
      );
      process.exit(0);
    });
  } catch (error) {
    console.error(
      "Could not connect to MongoDB using Mongoose:",
      error.message
    );
    process.exit(1); // Crucial for preventing app run on DB connection failure
  }
}

export { connectToDatabase };
