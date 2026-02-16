import { Router } from "express";
import {
  getAlertRules,
  createAlertRule,
  updateAlertRule,
  deleteAlertRule,
  getAlerts,
  updateAlert,
} from "./controller.js";

const router = Router();

// AlertRule CRUD — /rules before /:id to avoid route conflicts
router.get("/rules", getAlertRules);
router.post("/rules", createAlertRule);
router.patch("/rules/:id", updateAlertRule);
router.delete("/rules/:id", deleteAlertRule);

// Alert queries
router.get("/", getAlerts);
router.patch("/:id", updateAlert);

export default router;
