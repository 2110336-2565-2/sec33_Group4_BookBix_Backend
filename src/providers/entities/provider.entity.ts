import { Schema, model, Document } from 'mongoose';

export interface Provider extends Document {
  username: string;
  password: string;
  email: string;
  latest_device: string;
  date_created: Date;
  organization_name: string;
  locations: Array<any>;
}

export const ProviderSchema = new Schema({
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
  organization_name: {
    type: String,
  },
  locations: {
    type: [Object],
  },
});

export const ProviderModel = model<Provider>('Provider', ProviderSchema);
