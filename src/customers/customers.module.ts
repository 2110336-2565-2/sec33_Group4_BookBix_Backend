import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomerSchema } from './entities/customers.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { JwtAuthService } from 'src/auth/jwt.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'customers', schema: CustomerSchema }]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, JwtService, EmailService, JwtAuthService],
  exports: [CustomersService],
})
export class CustomersModule {}
