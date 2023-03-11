import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './entities/customers.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import * as crypto from 'crypto';
import { DateTime } from 'luxon';
import { EmailService } from '../auth/email/email.service';

@Injectable()
export class CustomersService {
  private resetTokenCache = new Map<
    string,
    { customer: Customer; expiry: DateTime }
  >();

  constructor(
    @InjectModel('customers') private readonly customerModel: Model<Customer>,
    private readonly emailService: EmailService,
  ) {}

  async insertNewCustomer(createCustomerDto: CreateCustomerDto) {
    const newCustomer = new this.customerModel(createCustomerDto);
    await newCustomer.save();
    return newCustomer;
  }

  async updateLatestDevice(
    customerId: string,
    latest_device: string,
    device_history: string,
  ) {
    const customer = await this.customerModel.findById(customerId);
    customer.latest_device = latest_device;
    customer.device_history.push(device_history);
    await customer.save();
    return customer;
  }

  async getCustomer(email: string) {
    const customer = await this.customerModel.findOne({ email });
    return customer;
  }

  async getCustomerById(customerId: string) {
    const customer = await this.customerModel.findById(customerId);
    return customer;
  }

  async getCustomerByEmail(email: string) {
    const customer = await this.customerModel.findOne({ email });
    return customer;
  }

  // update information
  async updateInformation(
    customerId: string,
    firstname: string,
    lastname: string,
    sex: string,
    birthdate: string,
    email: string,
  ) {
    console.log(customerId);

    const customer = await this.customerModel.findById(customerId);
    customer.firstname = firstname;
    customer.lastname = lastname;
    customer.sex = sex;
    customer.birthdate = birthdate;
    customer.email = email;

    await customer.save();
    return customer;
  }

  async getHistory(customerId: string) {
    const customer = await this.customerModel.findById(customerId);
    return customer.device_history;
  }
}
