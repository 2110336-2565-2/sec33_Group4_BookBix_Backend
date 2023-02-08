import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CustomersService } from "src/customers/customers.service";
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(private readonly customerService: CustomersService) {}

  //validate a user
  async validateCustomer(username: string, password: string): Promise<any> {
    const customer = await this.customerService.getCustomer(username);
    const passwordValid = await bcrypt.compare(password, customer.password)

    if (!customer) {
        throw new NotAcceptableException('could not find the user');
      }

    if (customer && passwordValid) {
      return {
        customerId: customer.id,
        userName: customer.username
      };
    }

    return null;
  }
}

