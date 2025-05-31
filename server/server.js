import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js"; // Assuming this is your main router
import { connectToDatabase } from "./config/connection.js";

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
    app.listen(PORT, () => {
      console.log(`Homestead API Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(
      `Server startup failed due to database connection error: ${err.message}`
    );
  });
