import prisma from "../prismaClient.js";

/**
 * Evaluate alert rules against a new sensor reading.
 * Returns array of created alerts (empty if none triggered).
 */
const evaluateAlertRules = async (reading, device) => {
  const createdAlerts = [];

  try {
    // Find enabled rules matching this sensor type (global or zone-scoped)
    const where = {
      sensorType: reading.sensorType,
      enabled: true,
    };

    // If device has a zone, match global rules (no zone) OR zone-scoped rules
    if (device?.zoneId) {
      where.OR = [{ zoneId: null }, { zoneId: device.zoneId }];
      delete where.sensorType;
      where.AND = [{ sensorType: reading.sensorType }, { enabled: true }];
      // Restructure for clarity
      delete where.enabled;
    }

    const rules = await prisma.alertRule.findMany({
      where: {
        sensorType: reading.sensorType,
        enabled: true,
        OR: device?.zoneId
          ? [{ zoneId: null }, { zoneId: device.zoneId }]
          : [{ zoneId: null }],
      },
    });

    for (const rule of rules) {
      // Check cooldown
      if (rule.lastTriggered) {
        const cooldownMs = rule.cooldownMin * 60 * 1000;
        const elapsed = Date.now() - rule.lastTriggered.getTime();
        if (elapsed < cooldownMs) continue;
      }

      // Evaluate condition
      const triggered = evaluateCondition(
        reading.value,
        rule.condition,
        rule.threshold,
        rule.thresholdHigh
      );

      if (!triggered) continue;

      // Create alert
      const alert = await prisma.alert.create({
        data: {
          deviceId: device?.id || null,
          alertRuleId: rule.id,
          severity: rule.severity,
          title: `${rule.name} triggered`,
          message: `${reading.sensorType} value ${reading.value} ${rule.condition} threshold ${rule.threshold}`,
        },
      });

      // Update lastTriggered
      await prisma.alertRule.update({
        where: { id: rule.id },
        data: { lastTriggered: new Date() },
      });

      createdAlerts.push(alert);
    }
  } catch (error) {
    console.error("Error evaluating alert rules:", error);
  }

  return createdAlerts;
};

/**
 * Evaluate a single condition against a value.
 */
const evaluateCondition = (value, condition, threshold, thresholdHigh) => {
  switch (condition) {
    case "lt":
      return value < threshold;
    case "gt":
      return value > threshold;
    case "eq":
      return value === threshold;
    case "between":
      return thresholdHigh != null && value >= threshold && value <= thresholdHigh;
    default:
      return false;
  }
};

export { evaluateAlertRules };
