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
      '', //firstname
      '', //lastname
      '', // sex
      '', // birthdate
      '', //username
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

  @Get('/login')
  async renderLoginPage(@Res() res) {
    return res.render('login');
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): any {
    return { customer: req.customer, msg: 'Customer logged in' };
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

    // send email to customer with password reset link containing token
    // ...

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
  ) {
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
