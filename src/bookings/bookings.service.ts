import { Injectable } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CustomersService } from 'src/customers/customers.service';
import { ProvidersService } from 'src/providers/providers.service';
import { Booking } from './bookings.model';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel('bookings') private readonly bookingModel: Model<Booking>,
    private readonly customerService: CustomersService,
    private readonly providerService: ProvidersService,
  ) {}

  //Create a new booking
  async createBooking(
    customer_email: string,
    provider_email: string,
    location_id: string,
    start_date: string,
    duration: number,
  ) {
    const converted_date = new Date(start_date);
    const customer_id = await this.customerService.getCustomer(customer_email);
    const provider_id = await this.providerService.getProvider(provider_email);
    const newBooking = new this.bookingModel({
      customer_id: customer_id,
      provider_id: provider_id, //Mock provider id
      location_id: location_id,
      start_date: converted_date,
      duration: duration,
      status: 'pending',
    });
    await newBooking.save();
    return newBooking;
  }

  //Get all unavailable timesot of a provider
  async getUnavailableTimeslot(provider_email: string, location_id: string) {
    const today = new Date();
    const provider_id = await this.providerService.getProvider(provider_email);
    const providerData = await this.bookingModel.aggregate([
      {
        $match: {
          provider_id: new mongoose.Types.ObjectId(provider_id._id),
          location_id: new mongoose.Types.ObjectId(location_id),
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

  //Get all bookings of a customer
  async getCustomerBookings(customer_email: string) {
    const customer_id = await this.customerService.getCustomer(customer_email);
    const customerBookings = await this.bookingModel
      .find({ customer_id: customer_id })
      .exec();

    // loop through the bookings and change the format
    const formattedBookings = [];
    for (const booking of customerBookings) {
      const startDate = new Date(booking.start_date);

      // Format HH:MM/YYYY-MM-DD
      const startDateString =
        startDate.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }) +
        '/' +
        startDate.toISOString().slice(0, 10);

      const endDate = new Date(
        startDate.getTime() + booking.duration * 3600000,
      );
      const endDateString =
        endDate.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }) +
        '/' +
        endDate.toISOString().slice(0, 10);

      formattedBookings.push({
        id: booking._id,
        location_name: '', // TODO: get location name
        location_id: booking.location_id,
        price: 300, // TODO: get price
        period: {
          start: startDateString,
          end: endDateString,
        },
        status: booking.status,
      });
    }
    return formattedBookings;
  }
}
