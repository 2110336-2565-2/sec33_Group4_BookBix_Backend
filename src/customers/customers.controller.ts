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
// import { JwtAuthService } from 'src/auth/jwt.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
@ApiTags('Customers') // Add tags for the API group
export class CustomersController {
  constructor(
    private readonly customerService: CustomersService,
    private jwtService: JwtService,
    // private jwtAuthService: JwtAuthService,
  ) {}

  @Put('/update/:id')
  @ApiOperation({ summary: 'Update customer profile' }) // Add operation summary
  @ApiParam({ name: 'id', description: 'Customer ID' }) // Add parameter description
  @ApiResponse({ status: 200, description: 'OK' }) // Add response description
  @ApiResponse({ status: 400, description: 'Bad Request' }) // Add response description
  @ApiBody({ type: UpdateCustomerDto }) // Add body description
  async updateProfile(
    @Request() req,
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
    @Body('sex') sex: string,
    @Body('birthdate') birthdate: string,
    @Body('email') email: string,
  ): Promise<any> {
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

  @Get('/:id')
  @ApiOperation({ summary: 'Get customer profile by ID' }) // Add operation summary
  @ApiParam({ name: 'id', description: 'Customer ID' }) // Add parameter description
  @ApiResponse({ status: 200, description: 'OK' }) // Add response description
  async getCustomer(@Param('id') id: string): Promise<any> {
    const customer = await this.customerService.getCustomerById(id);
    return customer;
  }

  @Get('/:customerId/history')
  @ApiOperation({ summary: 'Get customer history by ID' }) // Add operation summary
  @ApiParam({ name: 'customerId', description: 'Customer ID' }) // Add parameter description
  @ApiResponse({ status: 200, description: 'OK' }) // Add response description
  async getHistory(@Param('customerId') customerId: string): Promise<any> {
    const history = await this.customerService.getHistory(customerId);
    return history;
  }
}
