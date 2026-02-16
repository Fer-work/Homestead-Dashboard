import { Router } from "express";
import {
  getSolarArrays,
  getSolarArray,
  createSolarArray,
  updateSolarArray,
  getBatteryBanks,
  getBatteryBank,
  createBatteryBank,
  updateBatteryBank,
  getEnergyReadings,
  getEnergyStats,
} from "./controller.js";

const router = Router();

// Solar arrays
router.get("/solar", getSolarArrays);
router.post("/solar", createSolarArray);
router.get("/solar/:id", getSolarArray);
router.patch("/solar/:id", updateSolarArray);

// Battery banks
router.get("/batteries", getBatteryBanks);
router.post("/batteries", createBatteryBank);
router.get("/batteries/:id", getBatteryBank);
router.patch("/batteries/:id", updateBatteryBank);

// Sensor readings (VOLTAGE, CURRENT, POWER, ENERGY)
router.get("/readings", getEnergyReadings);

// Aggregated stats
router.get("/stats", getEnergyStats);

export default router;
