import { BadRequestException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserType } from './constants';
import { AdminsService } from '../admins/admins.service';
import { ProvidersService } from '../providers/providers.service';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import { CreateAdminDto } from '../admins/dto/create-admin.dto';
import { CreateProviderDto } from 'src/providers/dto/create-provider.dto';
import { EmailService } from './email/email.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomersService,
    private readonly adminService: AdminsService,
    private readonly providerService: ProvidersService,
    private jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

  async registerCustomer(
    email: string,
    username: string,
    password: string,
  ): Promise<any> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const now = new Date();
    const customerDto = new CreateCustomerDto();
    customerDto.username = username;
    customerDto.password = hashedPassword;
    customerDto.email = email;
    customerDto.date_created = now;

    const customer = await this.customerService.insertNewCustomer(customerDto);

    if (!customer) {
      throw new NotAcceptableException('Could not register the user');
    }
    return customer;
  }

  async registerAdmin(
    email: string,
    username: string,
    password: string,
  ): Promise<any> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const createAdminDto: CreateAdminDto = {
      email,
      username,
      password: hashedPassword,
      date_created: new Date(),
    };

    return await this.adminService.insertNewAdmin(createAdminDto);
  }
  async registerProvider(
    email: string,
    username: string,
    password: string,
  ): Promise<any> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const now = new Date();

    const createProviderDto = new CreateProviderDto();
    createProviderDto.username = username;
    createProviderDto.password = hashedPassword;
    createProviderDto.email = email;
    createProviderDto.date_created = now;

    const provider = await this.providerService.insertNewProvider(
      createProviderDto,
    );

    if (!provider) {
      throw new NotAcceptableException('Could not register the user');
    }
    return provider;
  }

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

  async validateAdmin(email: string, password: string): Promise<any> {
    const admin = await this.adminService.getAdmin(email);
    if (!admin) {
      throw new NotAcceptableException('Could not find the user');
    }
    const passwordValid = await bcrypt.compare(password, admin.password);
    if (admin && passwordValid) {
      return {
        id: admin.id,
        username: admin.username,
        latest_device: admin.latest_device,
      };
    }
    return null;
  }
  async validateProvider(email: string, password: string): Promise<any> {
    const provider = await this.providerService.getProvider(email);
    if (!provider) {
      throw new NotAcceptableException('Could not find the user');
    }
    const passwordValid = await bcrypt.compare(password, provider.password);
    if (provider && passwordValid) {
      return {
        id: provider.id,
        username: provider.username,
        latest_device: provider.latest_device,
      };
    }
    return null;
  }
  async validateUser(
    email: string,
    password: string,
    userType: UserType,
  ): Promise<any> {
    switch (userType) {
      case UserType.CUSTOMER:
        return await this.validateCustomer(email, password);
      case UserType.ADMIN:
        return await this.validateAdmin(email, password);
      case UserType.ADMIN:
        return await this.validateProvider(email, password);
      default:
        return null;
    }
  }
  async getUserType(email: string): Promise<UserType> {
    const customer = await this.customerService.getCustomer(email);
    if (customer) {
      return UserType.CUSTOMER;
    }
    const admin = await this.adminService.getAdmin(email);
    if (admin) {
      return UserType.ADMIN;
    }
    const provider = await this.providerService.getProvider(email);
    if (provider) {
      return UserType.PROVIDER;
    }
    return null;
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

  async getEmailBody(name:string, emailSubject:string, token:string){
    const resetUrl = `http://localhost:3000/auth/reset-password/${token}`;
    const emailBody = `
          <p>Hello ${name},</p>
          <p>You recently requested to reset your password for your My App account. Click the link below to reset it:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Thanks,</p>
          <p>Bookbix Team</p>
        `;
    return emailBody;
  }
  
  async sendPasswordResetEmail(email: string) {
    const userType = await this.getUserType(email);
    if (!userType) {
      throw new NotFoundException('User not found');
    }

    let user: any;

    switch (userType) {
      case UserType.CUSTOMER:
        user = await this.customerService.getCustomerByEmail(email);
        break;
      case UserType.ADMIN:
        user = await this.adminService.getAdminByEmail(email);
        break;
      case UserType.PROVIDER:
        user = await this.providerService.getProviderByEmail(email);
        break;
      default:
        throw new BadRequestException('Invalid user type');
    }
    console.log(user.name);
    
    const token = await this.generatePasswordResetToken(user, userType);
    const emailSubject = 'Reset your password on Bookbix';
    const emailBody = await this.getEmailBody(user.name, emailSubject, token);

    await this.emailService.sendEmail(email, emailSubject, emailBody);
  }


  async generatePasswordResetToken(user: any, userType:string): Promise<string> {
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload = {
      id: user.id,
      type: userType,
      sub: user.email,
    };
    console.log(payload);

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    return token;
  }

  async validatePasswordResetToken(token: string): Promise<boolean> {
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      return false;
    }
    console.log(decoded);
    
    let user: any;
    switch (decoded.type) {
      case UserType.CUSTOMER:
        user = await this.customerService.getCustomerById(decoded.id);
        break;
      case UserType.ADMIN:
        user = await this.adminService.getAdminById(decoded.id);
        break;
      case UserType.PROVIDER:
        user = await this.providerService.getProviderById(decoded.id);
    
        break;
    
      default:
        break;
    }
    
    if (!user) {
      return false;
    }
    return true;
  }

  async updatePasswordUsingToken(token: string, newPassword: string): Promise<void> {
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
    let user: any;
    switch (decoded.type) {
      case UserType.CUSTOMER:
        user = await this.customerService.getCustomerById(decoded.id);
        break;
      case UserType.ADMIN:
        user = await this.adminService.getAdminById(decoded.id);
        break;
      case UserType.PROVIDER:
        user = await this.providerService.getProviderById(decoded.id);
        break;
    
      default:
        break;
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  }

  
}
