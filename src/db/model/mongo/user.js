import uuidv4 from "uuid/v4";
import "./db";
import { Schema, Types, model } from "mongoose";

const CredentialSchema = new Schema({
  _id: { type: Types.UUID, default: uuidv4 },

  // Data
  credType: { type: String, required: true },

  // Password auth
  hash: String, // Bcrypt incorporates salt into hash

  // Api key auth
  key: String
});

const UserSchema = new Schema(
  {
    // Record
    _id: { type: Types.UUID, default: uuidv4 },
    createdBy: { type: Types.UUID, ref: "User" },
    updatedBy: { type: Types.UUID, ref: "User" },

    // Data
    person: { type: Types.UUID, ref: "Person" },
    company: { type: Types.UUID, ref: "Company", required: true },
    email: { type: String, required: true, unique: true },
    credentials: {
      type: [{ type: CredentialSchema, required: true }],
      required: true
    },
    permissions: {
      type: [String],
      required: true
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

export default model("User", UserSchema);
