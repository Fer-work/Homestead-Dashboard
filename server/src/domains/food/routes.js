import { Router } from "express";
import {
  getLatestWaterLevel,
  getAllWaterLevels,
  getWaterLevelHistory,
  getAquaponicsStats,
} from "./controller.js";

const router = Router();

// GET /api/aquaponics/waterlevel/latest
router.get("/waterlevel/latest", getLatestWaterLevel);

// GET /api/aquaponics/waterlevel/all
router.get("/waterlevel/all", getAllWaterLevels);

// GET /api/aquaponics/waterlevel/history?hours=24
router.get("/waterlevel/history", getWaterLevelHistory);

// GET /api/aquaponics/stats
router.get("/stats", getAquaponicsStats);

export default router;
