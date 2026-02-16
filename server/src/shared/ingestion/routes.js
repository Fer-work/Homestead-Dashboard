import { Router } from "express";
import { ingestReading, ingestReadings } from "./controller.js";

const router = Router();

// POST /api/ingest/reading — single reading
router.post("/reading", ingestReading);

// POST /api/ingest/readings — batch (max 100)
router.post("/readings", ingestReadings);

export default router;
