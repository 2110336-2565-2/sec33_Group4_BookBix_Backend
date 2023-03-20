import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationSchema } from './entities/location.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeModule } from 'src/payment/stripe/stripe.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Locations', schema: LocationSchema }]), // Remove trailing comma
    StripeModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService]
})
export class LocationModule {}
