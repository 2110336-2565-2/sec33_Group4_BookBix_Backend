import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from 'src/customers/customers.module';
import { BookingsController } from './bookings.controller';
import { BookingSchema } from './bookings.model';
import { BookingsService } from './bookings.service';
import { ProvidersModule } from 'src/providers/providers.module';
import { LocationsModule } from 'src/locations/locations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'bookings', schema: BookingSchema }]),
    CustomersModule,
    ProvidersModule,
    forwardRef(() => LocationsModule),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
