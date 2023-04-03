import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from 'src/customers/customers.module';
import { LocationSchema } from './entity/locations.entity';
import { ReviewsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { ProviderSchema } from 'src/providers/entities/provider.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'locations', schema: LocationSchema }]),
    MongooseModule.forFeature([{ name: 'providers', schema: ProviderSchema }]),
    CustomersModule,
  ],
  providers: [LocationsService],
  controllers: [ReviewsController],
  exports: [LocationsService],
})
export class LocationsModule {}
