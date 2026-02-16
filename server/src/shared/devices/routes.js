import { Router } from "express";
import {
  getDevices,
  getDevice,
  updateDevice,
  createCommand,
  getPendingCommands,
  updateCommand,
} from "./controller.js";

const router = Router();

// Device CRUD
router.get("/", getDevices);
router.get("/:id", getDevice);
router.patch("/:id", updateDevice);

// Device commands
router.post("/:deviceId/commands", createCommand);
router.get("/:deviceId/commands/pending", getPendingCommands);

export default router;

// Standalone command update route (mounted separately as /api/commands/:commandId)
export { updateCommand };
