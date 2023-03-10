import { Schema, model, Document } from 'mongoose';

export interface Review {
  title: string;
  username: string;
  rating: number;
  text: string;
  dateCreated: Date;
}

export interface Time {
  open_time: string;
  close_time: string;
}

export interface Location extends Document {
  name: string;
  address: string;
  description: string;
  url: string;
  images: string[];
  reviews: Review[];
  time: Time[];
  available_days: string[];
  price: number;
  avg_rating: number;
}

export const LocationSchema = new Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
  },
  images: {
    type: [String],
  },
  reviews: {
    type: [
      {
        _id: false,
        title: {
          type: String,
        },
        username: {
          type: String,
        },
        rating: {
          type: Number,
        },
        text: {
          type: String,
        },
        dateCreated: {
          type: Date,
        },
      },
    ],
  },
  time: {
    type: [
      {
        open_time: {
          type: String,
        },
        close_time: {
          type: String,
        },
      },
    ],
  },
  available_days: {
    type: [String],
  },
  price: {
    type: Number,
  },
  avg_rating: {
    type: Number,
  },
});

export const LocationModel = model<Location>('Location', LocationSchema);
