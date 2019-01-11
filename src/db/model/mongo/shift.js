import uuidv4 from "uuid/v4";
import "./db";
import { Schema, Types, model } from "mongoose";

const ShiftSchema = new Schema(
  {
    // Record
    _id: { type: Types.UUID, default: uuidv4 },
    createdBy: { type: Types.UUID, ref: "User" },
    updatedBy: { type: Types.UUID, ref: "User" },

    // Data
    startTime: { type: Date, required: true },
    // TODO: Add events
    endTime: Date,
    vehicle: { type: Types.UUID, ref: "Vehicle" },
    users: [{ type: Types.UUID, ref: "User" }]
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

export default model("Shift", ShiftSchema);
