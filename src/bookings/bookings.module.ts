import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from 'src/customers/customers.module';
import { BookingsController } from './bookings.controller';
import { BookingSchema } from './bookings.model';
import { BookingsService } from './bookings.service';
import { ProvidersModule } from 'src/providers/providers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'bookings', schema: BookingSchema }]),
    CustomersModule,
    ProvidersModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
