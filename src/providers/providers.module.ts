import { Module, forwardRef } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderSchema } from './entities/provider.entity';
import { StripeModule } from 'src/payment/stripe/stripe.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'providers', schema: ProviderSchema }]),
    StripeModule,
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
