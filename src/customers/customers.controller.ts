import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
  Param,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CustomersService } from './customers.service';
import DeviceDetector = require('device-detector-js');
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { JwtAuthService } from 'src/auth/jwt.service';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customerService: CustomersService,
    private jwtService: JwtService,
    private jwtAuthService: JwtAuthService,
  ) {}

  //manage profile
  //find id of customer and update
  @Put('/update/:id')
  updateProfile(
    @Request() req,
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
    @Body('sex') sex: string,
    @Body('birthdate') birthdate: string,
    @Body('email') email: string,
  ): any {
    try {
      this.customerService.updateInformation(
        req.params.id,
        firstname,
        lastname,
        sex,
        birthdate,
        email,
      );
      return {
        status: HttpStatus.OK,
        msg: 'Customer updated',
      };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
        msg: 'Customer not updated',
      };
    }
  }

  //@desc Get customer profile by id
  //@route GET /customers/:id
  //@access Public
  @Get('/:id')
  async getCustomer(@Param('id') id: string) {
    const customer = await this.customerService.getCustomerById(id);
    return customer;
  }

  @Get('/:customerId/history')
  async getHistory(@Param('customerId') customerId: string) {
    const history = await this.customerService.getHistory(customerId);
    return history;
  }
}
