import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
// Import both the connection function AND the sequelize instance
import sequelize, { connectToDatabase } from "./config/connection.js";

// Configurations
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

const PORT = process.env.PORT || 3001;

// Routes
app.use(routes);

// Database Connection and Server Start
connectToDatabase()
  .then(() => {
    // After connecting, synchronize the models with the database
    // This will create the 'aquaponics_readings' table if it doesn't exist
    return sequelize.sync({ alter: true }); // Use { alter: true } in dev to update tables
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Database synced. Dragon Natura API Server listening on http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(`Server startup failed: ${err.message}`);
  });
