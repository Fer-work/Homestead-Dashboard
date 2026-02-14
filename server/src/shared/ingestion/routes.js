import { Router } from "express";
import { ingestReading } from "./controller.js";

const router = Router();

// POST /api/ingest/reading
router.post("/reading", ingestReading);

export default router;
