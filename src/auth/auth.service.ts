import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserType } from './constants';
import { AdminsService } from "../admins/admins.service";
import { ProvidersService } from '../providers/providers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomersService,
    private readonly adminService: AdminsService,
    private readonly providerService: ProvidersService,
    private jwtService: JwtService,
  ) {}

  async registerCustomer(
    email: string,
    username: string,
    password: string,
  ): Promise<any> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const now = new Date();
    const customer = await this.customerService.insertNewCustomer(
      '', //firstname
      '', //lastname
      '', // sex
      '', // birthdate
      username, //username
      hashedPassword,
      email,
      now,
      '',
    );
    if (!customer) {
      throw new NotAcceptableException('Could not register the user');
    }
    return customer;
  }

  // async registerAdmin(username: string, password: string): Promise<any> {
  //   const admin = await this.adminService.insertNewAdmin(username, password); // TODO3: write a insertNewAdmin
  //   if (!admin) {
  //     throw new NotAcceptableException('Could not register the user');
  //   }
  //   return admin;
  // }
// TODO: after TODO3 uncomment registerAdmin function
  // async registerProvider(username: string, password: string): Promise<any> {
  //   const provider = await this.providerService.insertNewProvider(// TODO4: write a insertNewProvider
  //     username,
  //     password,
  //   );
  //   if (!provider) {
  //     throw new NotAcceptableException('Could not register the user');
  //   }
  //   return provider;
  // }
// TODO: after TODO4 uncomment registerProvider function
  async validateCustomer(email: string, password: string): Promise<any> {
    const customer = await this.customerService.getCustomer(email);
    if (!customer) {
      throw new NotAcceptableException('Could not find the user');
    }
    const passwordValid = await bcrypt.compare(password, customer.password);
    if (customer && passwordValid) {
      return {
        id: customer.id,
        username: customer.username,
        latest_device: customer.latest_device,
      };
    }
    return null;
  }

  // async validateAdmin(email: string, password: string): Promise<any> {
  //   const admin = await this.adminService.getAdmin(email); // TODO1: write a getAdmin service
  //   if (!admin) {
  //     throw new NotAcceptableException('Could not find the user');
  //   }
  //   const passwordValid = await bcrypt.compare(password, admin.password);
  //   if (admin && passwordValid) {
  //     return {
  //       id: admin.id,
  //       username: admin.username,
  //       latest_device: admin.latest_device,
  //     };
  //   }
  //   return null;
  // }
// TODO: after TODO1 uncomment validateAdmin function
  // async validateProvider(email: string, password: string): Promise<any> {
  //   const provider = await this.providerService.getProvider(email); // TODO2: write a getAdmin service
  //   if (!provider) {
  //     throw new NotAcceptableException('Could not find the user');
  //   }
  //   const passwordValid = await bcrypt.compare(password, provider.password);
  //   if (provider && passwordValid) {
  //     return {
  //       id: provider.id,
  //       username: provider.username,
  //       latest_device: provider.latest_device,
  //     };
  //   }
  //   return null;
  // }
// TODO: after TODO2 uncomment validateProvider function
  async validateUser(
    email: string,
    password: string,
    userType: UserType,
  ): Promise<any> {
    switch (userType) {
      case UserType.CUSTOMER:
        return await this.validateCustomer(email, password);
      // case UserType.ADMIN:
      //   return await this.validateAdmin(email, password);
      // case UserType.ADMIN:
      //   return await this.validateProvider(email, password);
      // TODO: after TODO1 and TODO2 uncomment case UserType.ADMIN:, case UserType.ADMIN:
      default:
        return null;
    }
  }

  async login(user: any, userType: UserType) {
    const payload = { username: user.username, sub: user.id, type: userType };
    return {
      access_token: await this.generateToken(payload),
    };
  }

  async generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }
  
}
