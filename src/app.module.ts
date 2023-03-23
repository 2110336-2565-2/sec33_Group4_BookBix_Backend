import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { CustomersModule } from './customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from "./email/email.module";
import { ProvidersModule } from './providers/providers.module';
import { AdminsModule } from './admins/admins.module';
import { StripeModule } from './payment/stripe/stripe.module';
import { LocationsModule } from './locations/locations.module';
@Module({
  imports: [
    EmailModule,
    BookingsModule,
    AuthModule,
    CustomersModule,
    MongooseModule.forRoot(
      //database url string
      process.env.MONGODB_DBURL,
    ),
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    ProvidersModule,
    AdminsModule,
    StripeModule,
    LocationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
