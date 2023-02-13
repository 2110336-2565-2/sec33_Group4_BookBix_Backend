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
import DeviceDetector = require("device-detector-js");

const deviceDetector = new DeviceDetector();
function getDevice(headers: {'user-agent': string }): string {
  const userAgent = headers['user-agent']; 
  const result = deviceDetector.parse(userAgent);
  console.log(JSON.stringify(result));
  if (!result.os) {
    return "POSTMAN - " + JSON.stringify(result.client.name).toUpperCase().slice(1,-1);
  }
  return JSON.stringify(result.os.name).toUpperCase().slice(1,-1)+ ' - ' +JSON.stringify(result.client.name).toUpperCase().slice(1,-1);
}

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Get('/register')
  async renderRegisterPage(@Res() res) {
    return res.render('register');
  }

  @Post('/register')
  async addCustomer(
    @Request() req,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const now = new Date();
    const latest_device = getDevice(req.headers);
    const result = await this.customerService.insertNewCustomer(
      "", //firstname
      "", //lastname
      "", // sex
      "" , // birthdate
      "", //username
      hashedPassword,
      email,
      now.toString(),
      latest_device,
      
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
