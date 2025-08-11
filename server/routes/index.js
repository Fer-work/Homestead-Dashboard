// routes/index.js

import { Router } from "express";

// Import all your individual route files
import dataIngestionRoutes from "./api/dataIngestionRoutes.js";
import aquaponicsRoutes from "./api/aquaponicsRoutes.js";
// import userRoutes from './api/userRoutes.js'; // etc.

const router = Router();

// This is the most important part.
// It tells the main router to use the specific route files
// for any path that starts with the given prefix.
router.use("/api/ingest", dataIngestionRoutes);
router.use("/api/aquaponics", aquaponicsRoutes);
// router.use('/api/users', userRoutes);

// A simple health-check route to make sure the router is working
router.get("/api/health", (req, res) => {
  res.status(200).json({ status: "API is up and running!" });
});

export default router;
