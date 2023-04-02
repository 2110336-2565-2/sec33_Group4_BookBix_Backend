import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderSchema } from './entities/provider.entity';
import { LocationSchema } from 'src/locations/entity/locations.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'providers', schema: ProviderSchema }]),
    MongooseModule.forFeature([{ name: 'locations', schema: LocationSchema }]),
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
