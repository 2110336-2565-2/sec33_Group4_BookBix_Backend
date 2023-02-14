import { Schema, model, Document } from 'mongoose';

export interface Booking extends Document {
  customer_id: Schema.Types.ObjectId;
  provider_id: Schema.Types.ObjectId;
  start_date: Date; // ISO 8601
  duration: number; // in minutes
  status: string; // 'pending', 'completed', 'cancelled'
}

export const BookingSchema = new Schema({
  customer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
  },
  provider_id: {
    type: Schema.Types.ObjectId,
    ref: 'Provider',
  },
  start_date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

export const CustomerModel = model<Booking>('Booking', BookingSchema);
