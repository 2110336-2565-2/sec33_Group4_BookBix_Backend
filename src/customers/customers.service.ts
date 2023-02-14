import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './customers.model';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel('customers') private readonly customerModel: Model<Customer>,
  ) {}

  //Signup new customer with username, password and other
  async insertNewCustomer(
    firstname: string,
    lastname: string,
    sex: string,
    birthdate: string,
    username: string,
    password: string,
    email: string,
    date_created: Date,
  ) {
    const usernameLower = username.toLowerCase();
    const newCustomer = new this.customerModel({
      firstname,
      lastname,
      sex,
      birthdate,
      username,
      password,
      email,
      date_created,
    });
    await newCustomer.save();
    return newCustomer;
  }

  //log in user using the findOne method
  async getCustomer(email: string) {
    const customer = await this.customerModel.findOne({ email });
    return customer;
  }
}
