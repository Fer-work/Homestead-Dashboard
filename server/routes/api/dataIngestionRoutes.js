// routes/dataIngestionRoutes.js

import { Router } from "express";

import { ingestReading } from "../../controllers/dataIngestionController.js";

const router = Router();

/**
 * @route   POST /api/ingest/reading
 * @desc    Ingest a new sensor reading from a device
 * @access  Public (or protected, depending on your auth strategy)
 */
router.post("/reading", ingestReading);

export default router;
