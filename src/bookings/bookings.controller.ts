import { Body, Controller, Get, Post, Request, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger'; // Import Swagger decorators\
import { CreateBookingDto } from './dto/bookings.dto';

@ApiTags('Bookings') // Add tags for the API group
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('/:customer_id')
  @ApiOperation({ summary: 'Get all bookings for a customer' })
  async getAllBookings(
    @Request() req,
    @Param('customer_id') customer_id: string,
  ) {
    const result = await this.bookingsService.getCustomerBookings(customer_id);
    return result;
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a booking' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateBookingDto })
  async createBooking(
    @Request() req,
    @Body('customer_id') customer_id: string,
    @Body('location_id') location_id: string,
    @Body('start_date') start_date: string,
    @Body('duration') duration: number,
  ) {
    try {
      const result = await this.bookingsService.createBooking(
        customer_id,
        location_id,
        start_date,
        duration,
      );
      return {
        msg: 'Booking successfully created',
        bookingId: result.id,
        locationId: location_id,
        duration: duration,
      };
    } catch (err) {
      return {
        status: 400,
        msg: 'Booking already exist',
      };
    }
  }
}
