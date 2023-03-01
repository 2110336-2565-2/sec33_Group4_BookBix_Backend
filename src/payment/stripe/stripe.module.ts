import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  imports: [ConfigModule],
  providers: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
