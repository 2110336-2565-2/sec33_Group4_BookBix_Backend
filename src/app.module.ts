import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    BookingModule,
    AuthModule,
    CustomersModule,
    MongooseModule.forRoot(
      //database url string
      process.env.MONGODB_DBURL,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
