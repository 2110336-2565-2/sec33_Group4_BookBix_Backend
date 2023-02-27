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

  
}
