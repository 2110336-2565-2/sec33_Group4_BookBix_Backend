import { Schema, model, Document } from 'mongoose';

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
  device_history: string[];
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
    type: Array<string>,
    required: true,
    default: [],
  },
});

export const CustomerModel = model<Customer>('Customer', CustomerSchema);
