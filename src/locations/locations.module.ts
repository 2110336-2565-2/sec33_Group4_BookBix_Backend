import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from 'src/customers/customers.module';
import { LocationSchema } from './entity/locations.entity';
import { ReviewsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { StripeModule } from 'src/payment/stripe/stripe.module';
import { StripeService } from 'src/payment/stripe/stripe.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'locations', schema: LocationSchema }]),
    CustomersModule,
    forwardRef(() => StripeModule),
  ],
  providers: [LocationsService],
  controllers: [ReviewsController],
  exports: [LocationsService],
})
export class LocationsModule {}
