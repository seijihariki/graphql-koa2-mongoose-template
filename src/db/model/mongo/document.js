import uuidv4 from 'uuid/v4';
import './db';
import { Schema, Types, model } from 'mongoose';

const DocumentSchema = new Schema(
  {
    // Record
    _id: { type: Types.UUID, default: uuidv4 },
    createdBy: { type: Types.UUID, ref: 'User' },
    updatedBy: { type: Types.UUID, ref: 'User' },

    // Data
    person: { type: Types.UUID, ref: 'Person' },
    company: { type: Types.UUID, ref: 'Company' },
    number: { type: String, required: true },
    docType: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export default model('Document', DocumentSchema);
