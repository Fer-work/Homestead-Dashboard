// models/AquaponicsReading.js

import { DataTypes } from "sequelize";
import sequelize from "../config/connection.js";

// Define the AquaponicsReading model using Sequelize
const AquaponicsReading = sequelize.define(
  "AquaponicsReading",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sensor_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    numeric_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(20),
    },
  },
  {
    tableName: "aquaponics_readings",
    timestamps: true,
    updatedAt: false,
    createdAt: "created_at",
  }
);

// This is the crucial change: export the model as the default export.
export default AquaponicsReading;
