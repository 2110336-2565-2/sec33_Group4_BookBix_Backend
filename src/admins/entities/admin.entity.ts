import { Schema, model, Document } from 'mongoose';

export interface Admin extends Document {
  username: string;
  password: string;
  email: string;
  latest_device: string;
  date_created: Date;
}

export const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
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
});

export const AdminModel = model<Admin>('Admin', AdminSchema);