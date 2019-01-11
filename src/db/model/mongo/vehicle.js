import uuidv4 from 'uuid/v4';
import './db';
import { Schema, Types, model } from 'mongoose';

import LocationSchema from './location';

const VehicleIdentifierSchema = new Schema({
  _id: { type: Types.UUID, default: uuidv4 },

  // Data
  idType: { type: String, required: true },
  number: { type: String, required: true },
});

const VehicleSchema = new Schema(
  {
    // Record
    _id: { type: Types.UUID, default: uuidv4 },
    createdBy: { type: Types.UUID, ref: 'User' },
    updatedBy: { type: Types.UUID, ref: 'User' },

    // Data
    identifier: { type: VehicleIdentifierSchema, required: true },
    company: { type: Types.UUID, ref: 'Company', required: true },
    state: { type: String, required: true },
    locations: { type: [{ type: LocationSchema, required: true }] },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export default model('Vehicle', VehicleSchema);
