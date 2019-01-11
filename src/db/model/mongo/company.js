import uuidv4 from 'uuid/v4';
import './db';
import { Schema, Types, model } from 'mongoose';

const CompanySchema = new Schema(
  {
    // Record
    _id: { type: Types.UUID, default: uuidv4 },
    createdBy: { type: Types.UUID, ref: 'User' },
    updatedBy: { type: Types.UUID, ref: 'User' },

    // Data
    legalName: { type: String, required: true },
    tradeName: String,
    documents: {
      type: [{ type: Types.UUID, ref: 'Document' }],
      required: true,
    },
    companyType: String,
    vehicles: [{ type: Types.UUID, ref: 'Vehicle' }],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

export default model('Company', CompanySchema);
