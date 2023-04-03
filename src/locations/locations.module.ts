import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from 'src/customers/customers.module';
import { LocationSchema } from './entity/locations.entity';
import { ReviewsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { ProviderSchema } from 'src/providers/entities/provider.entity';
import { ProvidersModule } from 'src/providers/providers.module';
import { BookingsModule } from 'src/bookings/bookings.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'locations', schema: LocationSchema }]),
    forwardRef(() => ProvidersModule),
    forwardRef(() => CustomersModule),
    forwardRef(() => BookingsModule),
  ],
  providers: [LocationsService],
  controllers: [ReviewsController],
  exports: [LocationsService],
})
export class LocationsModule {}
