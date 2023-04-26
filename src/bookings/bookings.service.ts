import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CustomersService } from 'src/customers/customers.service';
import { ProvidersService } from 'src/providers/providers.service';
import { Booking } from './bookings.model';
import { LocationsService } from 'src/locations/locations.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel('bookings') private readonly bookingModel: Model<Booking>,
    private readonly customerService: CustomersService,
    private readonly locationService: LocationsService,
  ) {}

  //Create a new booking
  async createBooking(
    customer_id: string,
    location_id: string,
    start_date: string,
    duration: number,
  ) {
    const converted_date = new Date(start_date);
    const newBooking = new this.bookingModel({
      customer_id: customer_id,
      location_id: location_id,
      start_date: converted_date,
      duration: duration,
      status: 'pending',
    });
    await newBooking.save();
    return newBooking;
  }

  //Get all unavailable timesot of a provider
  async getUnavailableTimeslot(location_id: string) {
    const today = new Date();
    const locationData = await this.bookingModel.aggregate([
      {
        $match: {
          location_id: new mongoose.Types.ObjectId(location_id),
          start_date: {
            $gte: today,
          },
        },
      },
      {
        $group: {
          _id: { start_date: '$start_date' },
          end_time: {
            $max: {
              $add: ['$start_date', { $multiply: ['$duration', 3600000] }], // Add duration to start_date in hou
            },
          },
        },
      },
    ]);

    if (locationData.length === 0) {
      return []; // return empty array if no data found for the given providerId
    }

    const formattedDates = [];
    for (const date of locationData) {
      const startDate = new Date(date._id.start_date);
      const startDateTime = startDate.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Bangkok',
      });

      const endDate = new Date(date.end_time);
      const endDateTime = endDate.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Bangkok',
      });

      const startDateString = startDate.toISOString().slice(0, 10);

      formattedDates.push([startDateTime, endDateTime, startDateString]);
    }
    return formattedDates;
  }

  //Get all bookings of a customer
  async getCustomerBookings(customer_id: string) {
    const customerBookings = await this.bookingModel
      .find({ customer_id: customer_id })
      .exec();

    // loop through the bookings and change the format
    const formattedBookings = [];
    for (const booking of customerBookings) {
      const startDate = new Date(booking.start_date);
      const locationObj = this.locationService.getLocationById(
        booking.location_id.toString(),
      );

      // Format HH:MM/YYYY-MM-DD
      const startDateString =
        startDate.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Bangkok',
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
          timeZone: 'Asia/Bangkok',
        }) +
        '/' +
        endDate.toISOString().slice(0, 10);

      formattedBookings.push({
        id:
          'b0' +
          booking._id.toString().slice(5, 8) +
          booking._id.toString().slice(0, 3) +
          booking._id.toString().slice(3, 5),
        location_name: (await locationObj).name,
        location_id: booking.location_id,
        price: (await locationObj).price,
        period: {
          start: startDateString,
          end: endDateString,
        },
        status: booking.status,
      });
    }
    return formattedBookings;
  }

  async updateBookingStatus(bookingId: string, newStatus: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }
    booking.status = newStatus;
    return booking.save();
  }
}
