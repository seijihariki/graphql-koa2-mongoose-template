import uuidv4 from 'uuid/v4';
import './db';
import { Schema, Types, model } from 'mongoose';

import LocationSchema from './location';

const TripSchema = new Schema(
  {
    // Record
    _id: { type: Types.UUID, default: uuidv4 },
    createdBy: { type: Types.UUID, ref: 'User' },
    updatedBy: { type: Types.UUID, ref: 'User' },

    // Data
    shift: { type: Types.UUID, ref: 'Shift' },

    pickupLocation: { type: LocationSchema, required: true },
    targetLocation: { type: LocationSchema, required: true },

    requestTime: { type: Date, default: Date.now },

    startTime: Date,
    pickupTime: Date,
    targetTime: Date,
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export default model('Trip', TripSchema);
