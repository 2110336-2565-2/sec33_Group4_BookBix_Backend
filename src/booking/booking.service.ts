import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomersService } from 'src/customers/customers.service';
import { Booking } from './booking.model';
@Injectable()
export class BookingService {
  constructor(
    @InjectModel('bookings') private readonly bookingModel: Model<Booking>,
    private readonly customerService: CustomersService, //private readonly providerService: ProviderService,
  ) {}

  async createBooking(
    customer_email: string,
    provider_email: string,
    start_date: Date,
    duration: number,
  ) {
    const customer_id = await this.customerService.getCustomer(customer_email);
    //const provider_id = await this.providerService.getProvider(provider_email);
    const newBooking = new this.bookingModel({
      customer_id,
      provider_id,
      start_date,
      duration,
    });
    await newBooking.save();
    return newBooking;
  }
}
