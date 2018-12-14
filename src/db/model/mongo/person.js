import uuidv4 from 'uuid/v4';
import './db';
import { Schema, Types, model } from 'mongoose';

const PersonSchema = new Schema(
  {
    // Record
    _id: { type: Types.UUID, default: uuidv4 },
    createdBy: { type: Types.UUID, ref: 'User' },
    updatedBy: { type: Types.UUID, ref: 'User' },

    // Data
    documents: {
      type: [{ type: Types.UUID, ref: 'Document' }],
      required: true,
    },
    name: String,
    nickname: String,
    birthDate: String,
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export default model('Person', PersonSchema);
