import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Get('/register')
  async renderRegisterPage(@Res() res) {
    return res.render('register');
  }

  @Post('/register')
  async addCustomer(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const now = new Date();
    const result = await this.customerService.insertNewCustomer(
      "", //firstname
      "", //lastname
      "", // sex
      "" , // birthdate
      "", //username
      hashedPassword,
      email,
      now.toString(),
    );

    return {
      msg: 'Customer successfully registered',
      customerId: result.id,
      customerEmail: result.email,
      customerUsername: result.username,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): any {
    return {customer: req.customer, msg: 'Customer logged in' };
  }


  @UseGuards(AuthenticatedGuard)
  @Get('/protected')
  getHello(@Request() req): string {
    return req.user;
  }

  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
