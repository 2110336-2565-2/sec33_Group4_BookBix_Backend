import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderSchema } from './entities/provider.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'providers', schema: ProviderSchema }]),
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
