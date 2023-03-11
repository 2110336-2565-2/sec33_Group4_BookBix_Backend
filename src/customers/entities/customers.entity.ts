import { Schema, model, Document } from 'mongoose';

export interface HistoryDevice {
  device: string;
  ip: string;
  date: Date;
}

export interface Customer extends Document {
  firstname: string;
  sex: string;
  lastname: string;
  birthdate: string;
  username: string;
  password: string;
  email: string;
  latest_device: string;
  date_created: Date;
  device_history: HistoryDevice[];
}

export const CustomerSchema = new Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  sex: {
    type: String,
  },
  birthdate: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  date_created: {
    type: Date,
    required: true,
  },
  latest_device: {
    type: String,
  },
  device_history: {
    type: Array<HistoryDevice>,
    required: true,
    default: [],
  },
});

export const CustomerModel = model<Customer>('Customer', CustomerSchema);
