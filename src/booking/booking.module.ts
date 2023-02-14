import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from 'src/customers/customers.module';
import { BookingController } from './booking.controller';
import { BookingSchema } from './booking.model';
import { BookingService } from './booking.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'bookings', schema: BookingSchema }]),
    CustomersModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
