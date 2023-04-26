import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { ProvidersModule } from 'src/providers/providers.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthService } from 'src/auth/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { LocationsModule } from 'src/locations/locations.module';
import { BookingsService } from 'src/bookings/bookings.service';
import { BookingsModule } from 'src/bookings/bookings.module';
@Module({
  imports: [BookingsModule,ConfigModule, ProvidersModule, LocationsModule,JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '60s' },
  })],
  providers: [StripeService, JwtAuthService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
