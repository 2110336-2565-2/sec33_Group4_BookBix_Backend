import { Schema, model, Document } from 'mongoose';

export interface Location extends Document {
  name: string;
  address: string;
  description: string;
  url: string;
  images: string[];
  reviews: string[];
  time: {
    start: string;
    end: string;
  };
  availableDays: string[];
}

export const LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  reviews: {
    type: [String],
    required: true,
  },
  time: {
    type: {
      start: {
        type: String,
        required: true,
      },
      end: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  availableDays: {
    type: [String],
    required: true,
  },
});

export const LocationModel = model<Location>('Locations', LocationSchema);
