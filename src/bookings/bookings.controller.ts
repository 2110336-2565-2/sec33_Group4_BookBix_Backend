import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('/unavailabletimeslot')
  async getUnavailableTimeslot(
    @Request() req,
    @Body('provider_email') provider_email: string,
  ) {
    const result = await this.bookingsService.getUnavailableTimeslot(
      provider_email,
    );

    return {
      msg: 'Successfully get unavailable timeslot',
      time_list: result,
    };
  }

  @Post('/')
  async createBooking(
    @Request() req,
    @Body('customer_email') customer_email: string,
    @Body('provider_email') provider_email: string,
    @Body('start_date') start_date: string,
    @Body('duration') duration: number,
    @Body('price_per_hour') price_per_hour: number, // Add this line to get the price_per_hour from the request body
  ) {
    const result = await this.bookingsService.createBooking(
      customer_email,
      provider_email,
      start_date,
      duration,
      price_per_hour, // Pass the price_per_hour to the createBooking() method in the BookingsService
    );
    return {
      msg: 'Booking successfully created',
      bookingId: result.id,
    };
  }

}
