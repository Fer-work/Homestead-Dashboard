import { Router } from "express";
import alertLogRoutes from "./alertLogRoutes.js";
import aquaponicsRoutes from "./aquaponicsRoutes.js";
import authRoutes from "./authRoutes.js";
import cameraRoutes from "./cameraRoutes.js";
import dataIngestionRoutes from "./dataIngestionRoutes.js";
import deviceRoutes from "./deviceRoutes.js";
import environmentalRoutes from "./environmentalRoutes.js";
import powerRoutes from "./powerRoutes.js";
import securityRoutes from "./securityRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/alerts", alertLogRoutes);
router.use("/aquaponics", aquaponicsRoutes);
router.use("/auth", authRoutes);
router.use("/camera", cameraRoutes);
router.use("/data", dataIngestionRoutes);
router.use("/device", deviceRoutes);
router.use("/environmental", environmentalRoutes);
router.use("/power", powerRoutes);
router.use("/security", securityRoutes);
router.use("/user", userRoutes);

export default router;
