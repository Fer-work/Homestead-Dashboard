import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import prisma from "./src/shared/prismaClient.js";
import { verifyToken } from "./src/shared/auth/middleware.js";
import authRoutes from "./src/shared/auth/routes.js";
import ingestionRoutes from "./src/shared/ingestion/routes.js";
import alertRoutes from "./src/shared/alerts/routes.js";
import deviceRoutes, { updateCommand } from "./src/shared/devices/routes.js";
import aquaponicsRoutes from "./src/domains/food/routes.js";
import energyRoutes from "./src/domains/energy/routes.js";

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

// Global auth — permissive (sets req.user if token present, null otherwise)
app.use(verifyToken);

const PORT = process.env.PORT || 3001;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ingest", ingestionRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/aquaponics", aquaponicsRoutes);
app.use("/api/energy", energyRoutes);

// Standalone command update route
app.patch("/api/commands/:commandId", updateCommand);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "API is up and running!" });
});

// Start server, verify database connection
app.listen(PORT, async () => {
  console.log(`Dragon Natura API Server listening on http://localhost:${PORT}`);

  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (err) {
    console.error(`Database connection failed: ${err.message}`);
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
