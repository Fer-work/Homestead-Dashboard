// routes/aquaponicsRoutes.js

import { Router } from "express";
import { getLatestWaterLevel } from "../../controllers/aquaponicsController.js";

const router = Router();

/**
 * @route   GET /api/aquaponics/waterlevel/latest
 * @desc    Get the most recent water level reading
 * @access  Public (for the dashboard)
 */
router.get("/waterlevel/latest", getLatestWaterLevel);

// ... any other aquaponics routes you might have

export default router;
