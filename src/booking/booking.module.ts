import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';

@Module({
  providers: [BookingService]
})
export class BookingModule {}
