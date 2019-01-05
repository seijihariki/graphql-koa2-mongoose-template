import './db';
import { Schema } from 'mongoose';

const LocationSchema = new Schema({
  // Data
  time: Date,
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

export default LocationSchema;
