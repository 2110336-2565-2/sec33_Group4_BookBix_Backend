import { Injectable } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CustomersService } from 'src/customers/customers.service';
import { Booking } from './bookings.model';
import { loadStripe } from '@stripe/stripe-js';
@Injectable()
export class BookingsService {
  constructor(
    @InjectModel('bookings') private readonly bookingModel: Model<Booking>,
    private readonly customerService: CustomersService, //private readonly providerService: ProviderService,
  ) {}

  //Create a new booking
  async createBooking(
    customer_email: string,
    provider_email: string,
    start_date: string,
    duration: number,
  ) {
    const converted_date = new Date(start_date);
    const customer_id = await this.customerService.getCustomer(customer_email);
    const newBooking = new this.bookingModel({
      customer_id: customer_id,
      provider_id: '000000000002000000000003', //Mock provider id
      start_date: converted_date,
      duration: duration,
      status: 'pending',
    });
    await newBooking.save();
    return newBooking;
  }

  
  

  //Get all unavailable timesot of a provider
  async getUnavailableTimeslot(provider_email: string) {
    const today = new Date();
    const providerData = await this.bookingModel.aggregate([
      {
        $match: {
          provider_id: new mongoose.Types.ObjectId('000000000002000000000003'),
          start_date: {
            $gte: today,
          },
        },
      },
      {
        $group: {
          _id: { provider_id: '$provider_id', start_date: '$start_date' },
          end_time: {
            $max: {
              $add: ['$start_date', { $multiply: ['$duration', 3600000] }], // Add duration to start_date in hou
            },
          },
        },
      },
    ]);

    if (providerData.length === 0) {
      return []; // return empty array if no data found for the given providerId
    }

    const formattedDates = [];
    for (const date of providerData) {
      const startDate = new Date(date._id.start_date);
      const startDateTime = startDate.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });

      const endDate = new Date(date.end_time);
      const endDateTime = endDate.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });

      const startDateString = startDate.toISOString().slice(0, 10);

      formattedDates.push([startDateTime, endDateTime, startDateString]);
    }
    return formattedDates;
  }
}
