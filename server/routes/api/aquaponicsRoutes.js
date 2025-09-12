// routes/aquaponicsRoutes.js

import { Router } from "express";
import { 
  getLatestWaterLevel, 
  getAllWaterLevels, 
  getWaterLevelHistory, 
  getAquaponicsStats 
} from "../../controllers/aquaponicsController.js";

const router = Router();

/**
 * @route   GET /api/aquaponics/waterlevel/latest
 * @desc    Get the most recent water level reading
 * @access  Public (for the dashboard)
 */
router.get("/waterlevel/latest", getLatestWaterLevel);

/**
 * @route   GET /api/aquaponics/waterlevel/all
 * @desc    Get all water level readings
 * @access  Public (for the dashboard)
 */
router.get("/waterlevel/all", getAllWaterLevels);

/**
 * @route   GET /api/aquaponics/waterlevel/history
 * @desc    Get water level history (supports ?hours=24 query parameter)
 * @access  Public (for the dashboard)
 */
router.get("/waterlevel/history", getWaterLevelHistory);

/**
 * @route   GET /api/aquaponics/stats
 * @desc    Get aquaponics system statistics and status
 * @access  Public (for the dashboard)
 */
router.get("/stats", getAquaponicsStats);

export default router;
