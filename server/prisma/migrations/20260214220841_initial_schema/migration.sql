-- CreateEnum
CREATE TYPE "Domain" AS ENUM ('ENERGY', 'FOOD', 'WATER', 'COMMS', 'DEFENSE', 'WORKSHOP');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('SENSOR', 'ACTUATOR', 'HYBRID', 'GATEWAY', 'CAMERA', 'ROVER', 'DRONE');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'ERROR', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "SensorType" AS ENUM ('PH', 'TEMPERATURE', 'WATER_LEVEL', 'HUMIDITY', 'DISSOLVED_OXYGEN', 'EC_TDS', 'VOLTAGE', 'CURRENT', 'POWER', 'ENERGY', 'GAS_PRESSURE', 'GAS_FLOW', 'WIND_SPEED', 'WIND_DIRECTION', 'LIGHT_LEVEL', 'SOIL_MOISTURE', 'CO2', 'MOTION', 'VIBRATION', 'WEIGHT');

-- CreateEnum
CREATE TYPE "CommandStatus" AS ENUM ('PENDING', 'SENT', 'ACKNOWLEDGED', 'EXECUTED', 'FAILED');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'SILENCED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OPERATOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "ThreatLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RoverStatus" AS ENUM ('IDLE', 'PATROLLING', 'CHARGING', 'MAINTENANCE', 'ALERT_RESPONSE');

-- CreateEnum
CREATE TYPE "DroneStatus" AS ENUM ('GROUNDED', 'IN_FLIGHT', 'CHARGING', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "DeterrentType" AS ENUM ('LED', 'ACOUSTIC', 'FOG', 'VOICE', 'COMBINED');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('PRINTER_3D', 'CNC', 'LASER_CUTTER', 'WELDING', 'SOLDERING', 'OSCILLOSCOPE', 'POWER_SUPPLY', 'OTHER');

-- CreateEnum
CREATE TYPE "InventoryCategory" AS ENUM ('FILAMENT', 'METAL_STOCK', 'ELECTRONICS', 'FASTENERS', 'CHEMICALS', 'LUMBER', 'PIPE_FITTINGS', 'SALVAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "LoraRole" AS ENUM ('GATEWAY', 'RELAY', 'ENDPOINT');

-- CreateTable
CREATE TABLE "zones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" "Domain" NOT NULL,
    "parentId" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deviceType" "DeviceType" NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'ONLINE',
    "zoneId" TEXT NOT NULL,
    "macAddress" TEXT,
    "mqttTopic" TEXT,
    "firmwareVersion" TEXT,
    "metadata" JSONB,
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensor_readings" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "sensorType" "SensorType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "sensor_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actuator_commands" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "parameters" JSONB,
    "status" "CommandStatus" NOT NULL DEFAULT 'PENDING',
    "issuedBy" TEXT,
    "sentAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actuator_commands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT,
    "alertRuleId" TEXT,
    "severity" "AlertSeverity" NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "acknowledgedBy" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT,
    "sensorType" "SensorType" NOT NULL,
    "condition" TEXT NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "thresholdHigh" DOUBLE PRECISION,
    "severity" "AlertSeverity" NOT NULL,
    "cooldownMin" INTEGER NOT NULL DEFAULT 15,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastTriggered" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alert_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_flows" (
    "id" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "destinationType" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "flowRate" DOUBLE PRECISION,
    "unit" VARCHAR(20),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_configs" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solar_arrays" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "panelCount" INTEGER NOT NULL,
    "panelWattage" INTEGER NOT NULL,
    "totalWattage" INTEGER NOT NULL,
    "mpptModel" TEXT,
    "tiltAngle" DOUBLE PRECISION,
    "azimuth" DOUBLE PRECISION,
    "installDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solar_arrays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battery_banks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "chemistry" TEXT NOT NULL,
    "cellCount" INTEGER NOT NULL,
    "nominalVoltage" DOUBLE PRECISION NOT NULL,
    "capacityAh" DOUBLE PRECISION NOT NULL,
    "capacityWh" DOUBLE PRECISION NOT NULL,
    "cycleCount" INTEGER NOT NULL DEFAULT 0,
    "maxCycles" INTEGER,
    "installDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "battery_banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biogas_digesters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "volumeLiters" DOUBLE PRECISION NOT NULL,
    "feedstockTypes" JSONB NOT NULL,
    "dailyGasOutputM3" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "installDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "biogas_digesters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wind_turbines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "ratedPowerW" INTEGER NOT NULL,
    "turbineType" TEXT NOT NULL,
    "cutInSpeedMs" DOUBLE PRECISION NOT NULL,
    "hubHeightM" DOUBLE PRECISION,
    "bladeCount" INTEGER,
    "installDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wind_turbines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aquaponics_systems" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "fishTankVolL" DOUBLE PRECISION NOT NULL,
    "fishSpecies" JSONB,
    "growBedCount" INTEGER NOT NULL,
    "growBedType" TEXT,
    "cropTypes" JSONB,
    "systemType" TEXT,
    "installDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aquaponics_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_forests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "areaSqM" DOUBLE PRECISION NOT NULL,
    "plantings" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "food_forests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chicken_coops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "birdCount" INTEGER NOT NULL,
    "breed" TEXT,
    "hasAutoDoor" BOOLEAN NOT NULL DEFAULT false,
    "hasAutoFeeder" BOOLEAN NOT NULL DEFAULT false,
    "hasAutoWater" BOOLEAN NOT NULL DEFAULT false,
    "manureOutputKgDay" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chicken_coops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vertical_gardens" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "towerCount" INTEGER NOT NULL,
    "plantSlots" INTEGER NOT NULL,
    "cropTypes" JSONB,
    "irrigationType" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vertical_gardens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mushroom_cultivations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "substrateType" TEXT NOT NULL,
    "activeBags" INTEGER NOT NULL,
    "harvestCycleDays" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mushroom_cultivations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "harvest_logs" (
    "id" TEXT NOT NULL,
    "aquaponicsSystemId" TEXT,
    "foodForestId" TEXT,
    "chickenCoopId" TEXT,
    "verticalGardenId" TEXT,
    "mushroomCultivationId" TEXT,
    "crop" TEXT NOT NULL,
    "quantityKg" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "qualityScore" INTEGER,
    "harvestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "harvest_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rainwater_cisterns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "capacityLiters" DOUBLE PRECISION NOT NULL,
    "catchmentAreaSqM" DOUBLE PRECISION NOT NULL,
    "hasFirstFlush" BOOLEAN NOT NULL DEFAULT false,
    "material" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rainwater_cisterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "greywater_systems" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "dailyCapacityL" DOUBLE PRECISION NOT NULL,
    "processingStages" JSONB NOT NULL,
    "outputUsage" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "greywater_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biosand_filters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "flowRateLph" DOUBLE PRECISION NOT NULL,
    "filterLayers" JSONB NOT NULL,
    "lastCleaned" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "biosand_filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atmospheric_water_gens" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "dailyOutputLiters" DOUBLE PRECISION NOT NULL,
    "powerSourceType" TEXT,
    "minHumidityPct" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atmospheric_water_gens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lora_nodes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "networkAddress" TEXT NOT NULL,
    "frequencyMhz" DOUBLE PRECISION NOT NULL,
    "spreadingFactor" INTEGER NOT NULL,
    "role" "LoraRole" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lora_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_inference_logs" (
    "id" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL,
    "outputTokens" INTEGER NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "domainServed" "Domain" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_inference_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL,
    "threatLevel" "ThreatLevel" NOT NULL,
    "eventType" TEXT NOT NULL,
    "aiConfidence" DOUBLE PRECISION,
    "description" TEXT NOT NULL,
    "responseTaken" JSONB,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patrol_rovers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "RoverStatus" NOT NULL DEFAULT 'IDLE',
    "batteryPct" DOUBLE PRECISION,
    "gpsLatitude" DOUBLE PRECISION,
    "gpsLongitude" DOUBLE PRECISION,
    "assignedRouteId" TEXT,
    "totalDistanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patrol_rovers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patrol_routes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "waypoints" JSONB NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "estimatedTimeMin" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patrol_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recon_drones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "DroneStatus" NOT NULL DEFAULT 'GROUNDED',
    "flightController" TEXT,
    "cameraType" TEXT,
    "totalFlightHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recon_drones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deterrent_systems" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "deterrentType" "DeterrentType" NOT NULL,
    "isArmed" BOOLEAN NOT NULL DEFAULT false,
    "activationCount" INTEGER NOT NULL DEFAULT 0,
    "lastActivatedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deterrent_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workshop_equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "equipmentType" "EquipmentType" NOT NULL,
    "zoneId" TEXT NOT NULL,
    "manufacturer" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "runHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nextMaintenanceAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workshop_equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "InventoryCategory" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'pcs',
    "minStockLevel" DOUBLE PRECISION,
    "costPerUnit" DOUBLE PRECISION,
    "isSalvage" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_logs" (
    "id" TEXT NOT NULL,
    "workshopEquipmentId" TEXT,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "description" TEXT NOT NULL,
    "partsUsed" JSONB,
    "totalCost" DOUBLE PRECISION,
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "recurrenceDays" INTEGER,
    "nextDueAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "preferences" JSONB,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_macAddress_key" ON "devices"("macAddress");

-- CreateIndex
CREATE INDEX "devices_zoneId_idx" ON "devices"("zoneId");

-- CreateIndex
CREATE INDEX "devices_status_idx" ON "devices"("status");

-- CreateIndex
CREATE INDEX "sensor_readings_deviceId_recordedAt_idx" ON "sensor_readings"("deviceId", "recordedAt");

-- CreateIndex
CREATE INDEX "sensor_readings_recordedAt_idx" ON "sensor_readings"("recordedAt");

-- CreateIndex
CREATE INDEX "sensor_readings_deviceId_sensorType_idx" ON "sensor_readings"("deviceId", "sensorType");

-- CreateIndex
CREATE INDEX "sensor_readings_sensorType_recordedAt_idx" ON "sensor_readings"("sensorType", "recordedAt");

-- CreateIndex
CREATE INDEX "actuator_commands_deviceId_status_idx" ON "actuator_commands"("deviceId", "status");

-- CreateIndex
CREATE INDEX "actuator_commands_status_idx" ON "actuator_commands"("status");

-- CreateIndex
CREATE INDEX "alerts_severity_status_idx" ON "alerts"("severity", "status");

-- CreateIndex
CREATE INDEX "alerts_status_idx" ON "alerts"("status");

-- CreateIndex
CREATE INDEX "alerts_createdAt_idx" ON "alerts"("createdAt");

-- CreateIndex
CREATE INDEX "resource_flows_sourceType_sourceId_idx" ON "resource_flows"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "resource_flows_destinationType_destinationId_idx" ON "resource_flows"("destinationType", "destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "system_configs_key_key" ON "system_configs"("key");

-- CreateIndex
CREATE INDEX "solar_arrays_zoneId_idx" ON "solar_arrays"("zoneId");

-- CreateIndex
CREATE INDEX "battery_banks_zoneId_idx" ON "battery_banks"("zoneId");

-- CreateIndex
CREATE INDEX "biogas_digesters_zoneId_idx" ON "biogas_digesters"("zoneId");

-- CreateIndex
CREATE INDEX "wind_turbines_zoneId_idx" ON "wind_turbines"("zoneId");

-- CreateIndex
CREATE INDEX "aquaponics_systems_zoneId_idx" ON "aquaponics_systems"("zoneId");

-- CreateIndex
CREATE INDEX "food_forests_zoneId_idx" ON "food_forests"("zoneId");

-- CreateIndex
CREATE INDEX "chicken_coops_zoneId_idx" ON "chicken_coops"("zoneId");

-- CreateIndex
CREATE INDEX "vertical_gardens_zoneId_idx" ON "vertical_gardens"("zoneId");

-- CreateIndex
CREATE INDEX "mushroom_cultivations_zoneId_idx" ON "mushroom_cultivations"("zoneId");

-- CreateIndex
CREATE INDEX "harvest_logs_harvestedAt_idx" ON "harvest_logs"("harvestedAt");

-- CreateIndex
CREATE INDEX "harvest_logs_aquaponicsSystemId_idx" ON "harvest_logs"("aquaponicsSystemId");

-- CreateIndex
CREATE INDEX "harvest_logs_foodForestId_idx" ON "harvest_logs"("foodForestId");

-- CreateIndex
CREATE INDEX "harvest_logs_chickenCoopId_idx" ON "harvest_logs"("chickenCoopId");

-- CreateIndex
CREATE INDEX "harvest_logs_verticalGardenId_idx" ON "harvest_logs"("verticalGardenId");

-- CreateIndex
CREATE INDEX "harvest_logs_mushroomCultivationId_idx" ON "harvest_logs"("mushroomCultivationId");

-- CreateIndex
CREATE INDEX "rainwater_cisterns_zoneId_idx" ON "rainwater_cisterns"("zoneId");

-- CreateIndex
CREATE INDEX "greywater_systems_zoneId_idx" ON "greywater_systems"("zoneId");

-- CreateIndex
CREATE INDEX "biosand_filters_zoneId_idx" ON "biosand_filters"("zoneId");

-- CreateIndex
CREATE INDEX "atmospheric_water_gens_zoneId_idx" ON "atmospheric_water_gens"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "lora_nodes_networkAddress_key" ON "lora_nodes"("networkAddress");

-- CreateIndex
CREATE INDEX "lora_nodes_zoneId_idx" ON "lora_nodes"("zoneId");

-- CreateIndex
CREATE INDEX "ai_inference_logs_domainServed_idx" ON "ai_inference_logs"("domainServed");

-- CreateIndex
CREATE INDEX "ai_inference_logs_createdAt_idx" ON "ai_inference_logs"("createdAt");

-- CreateIndex
CREATE INDEX "security_events_threatLevel_idx" ON "security_events"("threatLevel");

-- CreateIndex
CREATE INDEX "security_events_createdAt_idx" ON "security_events"("createdAt");

-- CreateIndex
CREATE INDEX "patrol_rovers_status_idx" ON "patrol_rovers"("status");

-- CreateIndex
CREATE INDEX "deterrent_systems_zoneId_idx" ON "deterrent_systems"("zoneId");

-- CreateIndex
CREATE INDEX "workshop_equipment_zoneId_idx" ON "workshop_equipment"("zoneId");

-- CreateIndex
CREATE INDEX "workshop_equipment_equipmentType_idx" ON "workshop_equipment"("equipmentType");

-- CreateIndex
CREATE INDEX "inventory_items_category_idx" ON "inventory_items"("category");

-- CreateIndex
CREATE INDEX "maintenance_logs_targetType_targetId_idx" ON "maintenance_logs"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "maintenance_logs_status_idx" ON "maintenance_logs"("status");

-- CreateIndex
CREATE INDEX "maintenance_logs_workshopEquipmentId_idx" ON "maintenance_logs"("workshopEquipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "zones" ADD CONSTRAINT "zones_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sensor_readings" ADD CONSTRAINT "sensor_readings_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actuator_commands" ADD CONSTRAINT "actuator_commands_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_alertRuleId_fkey" FOREIGN KEY ("alertRuleId") REFERENCES "alert_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_rules" ADD CONSTRAINT "alert_rules_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solar_arrays" ADD CONSTRAINT "solar_arrays_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battery_banks" ADD CONSTRAINT "battery_banks_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biogas_digesters" ADD CONSTRAINT "biogas_digesters_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wind_turbines" ADD CONSTRAINT "wind_turbines_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aquaponics_systems" ADD CONSTRAINT "aquaponics_systems_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_forests" ADD CONSTRAINT "food_forests_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chicken_coops" ADD CONSTRAINT "chicken_coops_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vertical_gardens" ADD CONSTRAINT "vertical_gardens_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mushroom_cultivations" ADD CONSTRAINT "mushroom_cultivations_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvest_logs" ADD CONSTRAINT "harvest_logs_aquaponicsSystemId_fkey" FOREIGN KEY ("aquaponicsSystemId") REFERENCES "aquaponics_systems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvest_logs" ADD CONSTRAINT "harvest_logs_foodForestId_fkey" FOREIGN KEY ("foodForestId") REFERENCES "food_forests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvest_logs" ADD CONSTRAINT "harvest_logs_chickenCoopId_fkey" FOREIGN KEY ("chickenCoopId") REFERENCES "chicken_coops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvest_logs" ADD CONSTRAINT "harvest_logs_verticalGardenId_fkey" FOREIGN KEY ("verticalGardenId") REFERENCES "vertical_gardens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvest_logs" ADD CONSTRAINT "harvest_logs_mushroomCultivationId_fkey" FOREIGN KEY ("mushroomCultivationId") REFERENCES "mushroom_cultivations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rainwater_cisterns" ADD CONSTRAINT "rainwater_cisterns_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "greywater_systems" ADD CONSTRAINT "greywater_systems_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biosand_filters" ADD CONSTRAINT "biosand_filters_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atmospheric_water_gens" ADD CONSTRAINT "atmospheric_water_gens_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lora_nodes" ADD CONSTRAINT "lora_nodes_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patrol_rovers" ADD CONSTRAINT "patrol_rovers_assignedRouteId_fkey" FOREIGN KEY ("assignedRouteId") REFERENCES "patrol_routes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deterrent_systems" ADD CONSTRAINT "deterrent_systems_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshop_equipment" ADD CONSTRAINT "workshop_equipment_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_workshopEquipmentId_fkey" FOREIGN KEY ("workshopEquipmentId") REFERENCES "workshop_equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
