import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './customers.model';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { DateTime } from 'luxon';
import { EmailService } from './services/email.service';

@Injectable()
export class CustomersService {
  private resetTokenCache = new Map<string, { customer: Customer; expiry: DateTime }>();

  constructor(
    @InjectModel('customers')
    private readonly customerModel: Model<Customer>,
    private readonly emailService: EmailService,
  ) {}

  async insertNewCustomer(
    firstname: string,
    lastname: string,
    sex: string,
    birthdate: string,
    username: string,
    password: string,
    email: string,
    date_created: string,
  ) {
    const usernameLower = username.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = new this.customerModel({
      firstname,
      lastname,
      sex,
      birthdate,
      username,
      password: hashedPassword,
      email,
      date_created,
    });
    await newCustomer.save();
    return newCustomer;
  }

  async getCustomer(email: string) {
    const customer = await this.customerModel.findOne({ email });
    return customer;
  }

  async sendPasswordResetEmail(customer: Customer) {
    const token = crypto.randomBytes(20).toString('hex');
    const expiry = DateTime.now().plus({ hours: 1 });
    this.resetTokenCache.set(customer.email, { customer, expiry });
    const resetUrl = `http://localhost:3000/resetpassword/${token}`;
    const emailBody = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`;
    const emailSubject = 'Reset your password on Bookbix';
    const emailTo = customer.email;
    this.emailService.sendEmail(emailTo, emailSubject, emailBody);
  }

  async validatePasswordResetToken(token: string) {
    const entry = this.resetTokenCache.get(token);
    if (!entry) {
      return false;
    }
    const { customer, expiry } = entry;
    if (expiry < DateTime.now()) {
      this.resetTokenCache.delete(customer.email);
      return false;
    }
    return true;
  }

  async setNewPassword(token: string, password: string) {
    const isValidToken = await this.validatePasswordResetToken(token);
    if (!isValidToken) {
      // invalid token
      return { msg: 'Invalid password reset token' };
    }

    const entry = this.resetTokenCache.get(token);
    const { customer } = entry;
    const hashedPassword = await bcrypt.hash(password, 10);
    customer.password = hashedPassword;
    this.resetTokenCache.delete(customer.email);
    await customer.save();
    return { msg: 'Password has been reset' };
  }

  async updatePasswordUsingToken(token: string, hashedPassword: string) {
    const isValidToken = await this.validatePasswordResetToken(token);
    if (!isValidToken) {
      // invalid token
      return { msg: 'Invalid password reset token' };
    }
    const entry = this.resetTokenCache.get(token);
    const { customer } = entry;
    customer.password = hashedPassword;
    this.resetTokenCache.delete(customer.email);
    await customer.save();
    return { msg: 'Password has been updated' };
  }

  async generatePasswordResetToken(customerId: string) {
    const customer = await this.customerModel.findById(customerId);
    if (!customer) {
      return { msg: 'Customer not found' };
    }
    await this.sendPasswordResetEmail(customer);
    return { msg: 'Password reset email sent' };
  }

  async getCustomerByEmail(email: string) {
    const customer = await this.customerModel.findOne({ email });
    return customer;
  }
  
}
