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

  @Get('/register')
  async renderRegisterPage(@Res() res) {
    return res.render('register');
  }

  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }

  @Get('/resetpassword')
  async renderResetPasswordPage(@Res() res) {
    return res.render('resetpassword');
  }

  @Post('/resetpassword')
  async resetPassword(@Body('email') email: string) {
    const customer = await this.customerService.getCustomerByEmail(email);
    if (!customer) {
      // customer not found
      return { msg: 'No customer found with that email address' };
    }

    const token = await this.customerService.generatePasswordResetToken(
      customer.id,
    );
    if (!token) {
      // error generating token
      return { msg: 'Error generating password reset token' };
    }

    await this.customerService.sendPasswordResetEmail(customer);

    return { msg: 'Password reset email sent' };
  }

  @Get('/resetpassword/:token')
  async renderNewPasswordPage(@Param('token') token: string, @Res() res) {
    const isValidToken = await this.customerService.validatePasswordResetToken(
      token,
    );
    if (!isValidToken) {
      // invalid token
      return res.status(400).send({ msg: 'Invalid password reset token' });
    }

    return res.render('newpassword', { token });
  }

  @Put('/resetpassword/:token')
  async setNewPassword(
    @Param('token') token: string,
    @Body('password') password: string,
    @Body('confirmPassword') confirmPassword: string,
  ) {
    if (password !== confirmPassword) {
      // password and confirm password do not match
      return { msg: 'Password and confirm password do not match' };
    }

    const isValidToken = await this.customerService.validatePasswordResetToken(
      token,
    );
    if (!isValidToken) {
      // invalid token
      return { msg: 'Invalid password reset token' };
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    await this.customerService.updatePasswordUsingToken(token, hashedPassword);

    return { msg: 'Password updated successfully' };
  }
}
