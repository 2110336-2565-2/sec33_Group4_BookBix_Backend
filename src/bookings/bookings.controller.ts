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
  ) {
    console.log(req);
    const result = await this.bookingsService.createBooking(
      customer_email,
      provider_email,
      start_date,
      duration,
    );
    return {
      msg: 'Booking successfully created',
      bookingId: result.id,
    };
  }
}
