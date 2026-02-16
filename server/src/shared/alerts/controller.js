import prisma from "../prismaClient.js";

const VALID_SENSOR_TYPES = [
  "PH", "TEMPERATURE", "WATER_LEVEL", "HUMIDITY", "DISSOLVED_OXYGEN",
  "EC_TDS", "VOLTAGE", "CURRENT", "POWER", "ENERGY", "GAS_PRESSURE",
  "GAS_FLOW", "WIND_SPEED", "WIND_DIRECTION", "LIGHT_LEVEL",
  "SOIL_MOISTURE", "CO2", "MOTION", "VIBRATION", "WEIGHT",
];

const VALID_CONDITIONS = ["lt", "gt", "eq", "between"];

// --- AlertRule CRUD ---

const getAlertRules = async (req, res) => {
  const { sensorType, enabled } = req.query;

  const where = {};
  if (sensorType) where.sensorType = sensorType;
  if (enabled !== undefined) where.enabled = enabled === "true";

  try {
    const rules = await prisma.alertRule.findMany({
      where,
      include: { zone: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ data: rules });
  } catch (error) {
    console.error("Error in getAlertRules:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const createAlertRule = async (req, res) => {
  const { name, zoneId, sensorType, condition, threshold, thresholdHigh, severity, cooldownMin } = req.body;

  if (!name || !sensorType || !condition || threshold === undefined || !severity) {
    return res.status(400).json({
      error: "Required fields: name, sensorType, condition, threshold, severity.",
    });
  }

  if (!VALID_SENSOR_TYPES.includes(sensorType)) {
    return res.status(400).json({ error: `Invalid sensorType: ${sensorType}` });
  }

  if (!VALID_CONDITIONS.includes(condition)) {
    return res.status(400).json({ error: `Invalid condition. Must be one of: ${VALID_CONDITIONS.join(", ")}` });
  }

  if (condition === "between" && thresholdHigh === undefined) {
    return res.status(400).json({ error: "condition 'between' requires thresholdHigh." });
  }

  try {
    const rule = await prisma.alertRule.create({
      data: {
        name,
        zoneId: zoneId || null,
        sensorType,
        condition,
        threshold,
        thresholdHigh: thresholdHigh ?? null,
        severity,
        cooldownMin: cooldownMin ?? 15,
      },
    });

    res.status(201).json({ data: rule });
  } catch (error) {
    console.error("Error in createAlertRule:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const updateAlertRule = async (req, res) => {
  const { id } = req.params;
  const { name, zoneId, sensorType, condition, threshold, thresholdHigh, severity, cooldownMin, enabled } = req.body;

  if (sensorType && !VALID_SENSOR_TYPES.includes(sensorType)) {
    return res.status(400).json({ error: `Invalid sensorType: ${sensorType}` });
  }

  if (condition && !VALID_CONDITIONS.includes(condition)) {
    return res.status(400).json({ error: `Invalid condition: ${condition}` });
  }

  try {
    const data = {};
    if (name !== undefined) data.name = name;
    if (zoneId !== undefined) data.zoneId = zoneId || null;
    if (sensorType !== undefined) data.sensorType = sensorType;
    if (condition !== undefined) data.condition = condition;
    if (threshold !== undefined) data.threshold = threshold;
    if (thresholdHigh !== undefined) data.thresholdHigh = thresholdHigh;
    if (severity !== undefined) data.severity = severity;
    if (cooldownMin !== undefined) data.cooldownMin = cooldownMin;
    if (enabled !== undefined) data.enabled = enabled;

    const rule = await prisma.alertRule.update({
      where: { id },
      data,
    });

    res.status(200).json({ data: rule });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Alert rule not found." });
    }
    console.error("Error in updateAlertRule:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const deleteAlertRule = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.alertRule.delete({ where: { id } });
    res.status(200).json({ message: "Alert rule deleted." });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Alert rule not found." });
    }
    console.error("Error in deleteAlertRule:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

// --- Alert queries ---

const getAlerts = async (req, res) => {
  const { status, severity, limit = "50", offset = "0" } = req.query;

  const where = {};
  if (status) where.status = status;
  if (severity) where.severity = severity;

  try {
    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
        where,
        include: { device: true, alertRule: true },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.alert.count({ where }),
    ]);

    res.status(200).json({ data: alerts, total, limit: parseInt(limit), offset: parseInt(offset) });
  } catch (error) {
    console.error("Error in getAlerts:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const updateAlert = async (req, res) => {
  const { id } = req.params;
  const { status, acknowledgedBy } = req.body;

  try {
    const data = {};
    if (status) data.status = status;
    if (status === "ACKNOWLEDGED") {
      data.acknowledgedAt = new Date();
      if (acknowledgedBy) data.acknowledgedBy = acknowledgedBy;
    }
    if (status === "RESOLVED") {
      data.resolvedAt = new Date();
    }

    const alert = await prisma.alert.update({
      where: { id },
      data,
    });

    res.status(200).json({ data: alert });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Alert not found." });
    }
    console.error("Error in updateAlert:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export { getAlertRules, createAlertRule, updateAlertRule, deleteAlertRule, getAlerts, updateAlert };
