import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomersService,
    private jwtService: JwtService,
  ) {}

  //validate a user
  async validateCustomer(email: string, password: string): Promise<any> {
    const customer = await this.customerService.getCustomer(email);
    console.log(customer);
    const passwordValid = await bcrypt.compare(password, customer.password);

    if (!customer) {
      throw new NotAcceptableException('could not find the user');
    }

    if (customer && passwordValid) {
      return {
        id: customer.id,
        email: customer.email,
        latest_device: customer.latest_device,
      };
    }

    return null;
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
