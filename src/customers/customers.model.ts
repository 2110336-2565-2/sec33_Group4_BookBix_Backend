import { Schema, model, Document } from 'mongoose';

export interface Customer extends Document {
  firstname: string;
  lastname: string;
  sex: string;
  birthdate: string;
  username: string;
  password: string;
  email: string;
  date_created: string;
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
});

export const CustomerModel = model<Customer>('Customer', CustomerSchema);
