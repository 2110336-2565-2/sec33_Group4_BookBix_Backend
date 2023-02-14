import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/create')
  async createBooking(
    @Request() req,
    @Body('customer_email') customer_email: string,
    @Body('provider_email') provider_email: string,
    @Body('start_date') start_date: Date,
    @Body('duration') duration: number,
    @Body('status') status: string,
  ) {
    const result = await this.bookingService.createBooking(
      customer_id,
      provider_id,
      start_date,
      duration,
      status,
    );
    return {
      msg: 'Booking successfully created',
      bookingId: result.id,
    };
  }
}
