import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from 'src/customers/customers.module';
import { LocationSchema } from './entity/locations.entity';
import { ReviewsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { BookingsModule } from 'src/bookings/bookings.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'locations', schema: LocationSchema }]),
    CustomersModule,
    forwardRef(() => BookingsModule),
  ],
  providers: [LocationsService],
  controllers: [ReviewsController],
  exports: [LocationsService],
})
export class LocationsModule {}
