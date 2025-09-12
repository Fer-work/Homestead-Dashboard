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

// Start server first, then connect to database in background
app.listen(PORT, () => {
  console.log(`Dragon Natura API Server listening on http://localhost:${PORT}`);
  
  // Connect to database in background (non-blocking)
  connectToDatabase()
    .then(() => {
      console.log("Database connected successfully");
      return sequelize.sync({ alter: true });
    })
    .then(() => {
      console.log("Database synced successfully");
    })
    .catch((err) => {
      console.error(`Database connection failed: ${err.message}`);
    });
});
