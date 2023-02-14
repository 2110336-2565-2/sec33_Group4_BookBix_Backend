import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from "./customers.model";

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel('customers') private readonly customerModel: Model<Customer> ,
  ) {}

  //Signup new customer with username, password and other
    async insertNewCustomer(firstname: string, lastname: string, sex: string, birthdate: string, username: string, password: string, email: string, date_created: string,latest_device:string) {
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
      latest_device,
    });
    await newCustomer.save();
    return newCustomer;
  }

  async updateLatestDevice(customerId: string, latest_device: string) {
    console.log(customerId);
    const customer = await this.customerModel.findById(customerId);
    customer.latest_device = latest_device;
    await customer.save();
    return customer;
  }
  
  //log in user using the findOne method
  async getCustomer(email: string) {
    const customer = await this.customerModel.findOne({ email });
    return customer;
  }
}
