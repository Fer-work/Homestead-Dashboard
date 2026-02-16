import prisma from "../prismaClient.js";

const getDevices = async (req, res) => {
  const { zoneId, status, deviceType } = req.query;

  const where = {};
  if (zoneId) where.zoneId = zoneId;
  if (status) where.status = status;
  if (deviceType) where.deviceType = deviceType;

  try {
    const devices = await prisma.device.findMany({
      where,
      include: { zone: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ data: devices });
  } catch (error) {
    console.error("Error in getDevices:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const getDevice = async (req, res) => {
  const { id } = req.params;

  try {
    const device = await prisma.device.findUnique({
      where: { id },
      include: {
        zone: true,
        sensorReadings: {
          orderBy: { recordedAt: "desc" },
          take: 10,
        },
        actuatorCommands: {
          where: { status: "PENDING" },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!device) {
      return res.status(404).json({ error: "Device not found." });
    }

    res.status(200).json({ data: device });
  } catch (error) {
    console.error("Error in getDevice:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const updateDevice = async (req, res) => {
  const { id } = req.params;
  const { name, zoneId, status, deviceType, macAddress, mqttTopic, firmwareVersion, metadata } = req.body;

  try {
    const data = {};
    if (name !== undefined) data.name = name;
    if (zoneId !== undefined) data.zoneId = zoneId;
    if (status !== undefined) data.status = status;
    if (deviceType !== undefined) data.deviceType = deviceType;
    if (macAddress !== undefined) data.macAddress = macAddress;
    if (mqttTopic !== undefined) data.mqttTopic = mqttTopic;
    if (firmwareVersion !== undefined) data.firmwareVersion = firmwareVersion;
    if (metadata !== undefined) data.metadata = metadata;

    const device = await prisma.device.update({
      where: { id },
      data,
      include: { zone: true },
    });

    res.status(200).json({ data: device });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Device not found." });
    }
    console.error("Error in updateDevice:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const createCommand = async (req, res) => {
  const { deviceId } = req.params;
  const { command, parameters } = req.body;

  if (!command) {
    return res.status(400).json({ error: "command is required." });
  }

  try {
    // Verify device exists
    const device = await prisma.device.findUnique({ where: { id: deviceId } });
    if (!device) {
      return res.status(404).json({ error: "Device not found." });
    }

    const cmd = await prisma.actuatorCommand.create({
      data: {
        deviceId,
        command,
        parameters: parameters || null,
        issuedBy: req.user?.userId || null,
      },
    });

    res.status(201).json({ data: cmd });
  } catch (error) {
    console.error("Error in createCommand:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const getPendingCommands = async (req, res) => {
  const { deviceId } = req.params;

  try {
    const commands = await prisma.actuatorCommand.findMany({
      where: { deviceId, status: "PENDING" },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json({ data: commands });
  } catch (error) {
    console.error("Error in getPendingCommands:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const updateCommand = async (req, res) => {
  const { commandId } = req.params;
  const { status, failureReason } = req.body;

  try {
    const data = {};
    if (status) data.status = status;
    if (status === "SENT") data.sentAt = new Date();
    if (status === "ACKNOWLEDGED") data.acknowledgedAt = new Date();
    if (status === "EXECUTED") data.executedAt = new Date();
    if (status === "FAILED") {
      data.failureReason = failureReason || null;
    }

    const cmd = await prisma.actuatorCommand.update({
      where: { id: commandId },
      data,
    });

    res.status(200).json({ data: cmd });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Command not found." });
    }
    console.error("Error in updateCommand:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export { getDevices, getDevice, updateDevice, createCommand, getPendingCommands, updateCommand };
