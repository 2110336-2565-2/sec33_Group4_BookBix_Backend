import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomerSchema } from './customers.model';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './services/email.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'customers', schema: CustomerSchema }]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, JwtService, EmailService],
  exports: [CustomersService],
})
export class CustomersModule {}
