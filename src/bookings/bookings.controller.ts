import { Body, Controller, Get, Post, Request, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('/:customer_id')
  async getAllBookings(
    @Request() req,
    @Param('customer_id') customer_id: string,
  ) {
    const result = await this.bookingsService.getCustomerBookings(customer_id);
    return result;
  }

  @Post('/')
  async createBooking(
    @Request() req,
    @Body('customer_id') customer_id: string,
    @Body('location_id') location_id: string,
    @Body('start_date') start_date: string,
    @Body('duration') duration: number,
  ) {
    const result = await this.bookingsService.createBooking(
      customer_id,
      location_id,
      start_date,
      duration,
    );
    return {
      msg: 'Booking successfully created',
      bookingId: result.id,
    };
  }
}
