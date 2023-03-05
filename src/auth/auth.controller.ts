import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { UserType } from './constants';
import { CustomersService } from 'src/customers/customers.service';
import { AdminsService } from 'src/admins/admins.service';
import { ProvidersService } from 'src/providers/providers.service';
import DeviceDetector = require('device-detector-js');
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { RolesGuard } from './guards/roles.auth.guard';
import { AuthGuard } from '@nestjs/passport';
const deviceDetector = new DeviceDetector();
function getDevice(headers: { 'user-agent': string }): string {
  const userAgent = headers['user-agent'];
  const result = deviceDetector.parse(userAgent);
  // console.log(JSON.stringify(result));
  if (!result.os) {
    return (
      'POSTMAN - ' +
      JSON.stringify(result.client.name).toUpperCase().slice(1, -1)
    );
  }
  return (
    JSON.stringify(result.os.name).toUpperCase().slice(1, -1) +
    ' - ' +
    JSON.stringify(result.client.name).toUpperCase().slice(1, -1)
  );
}
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminsService,
    private readonly customerService: CustomersService,
    private readonly providerService: ProvidersService,
    private jwtService: JwtService,
    private jwtAuthService: JwtAuthService,
  ) {}
  @Post('/register')
  async register(
    @Body('email') email: string,
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('userType') userType: UserType,
    @Request() req,
  ) {
    let user;
    if (userType === UserType.CUSTOMER) {
      user = await this.authService.registerCustomer(email, username, password);
    } else if (userType === UserType.ADMIN) {
      user = await this.authService.registerAdmin(email, username, password);
    } else if (userType === UserType.PROVIDER) {
      user = await this.authService.registerProvider(email, username, password);
    } else {
      return {
        msg: 'Invalid user type',
      };
    }

    const payload = {
      username: user.username,
      sub: user._id,
      type: userType,
    };
    const access_token = await this.authService.generateToken(payload);
    this.jwtAuthService.createCookie(req.res, access_token);

    let successMsg;
    switch (userType) {
      case UserType.CUSTOMER:
        successMsg = 'Customer successfully registered';
        break;
      case UserType.ADMIN:
        successMsg = 'Admin successfully registered';
        break;
      case UserType.PROVIDER:
        successMsg = 'Provider successfully registered';
        break;
    }
    return {
      msg: successMsg,
      access_token: access_token,
    };
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserType.ADMIN, UserType.CUSTOMER, UserType.PROVIDER])
  @Post('/login')
  async login(@Request() req) {
    let user: any;
    const { email, password } = req.body;
    const userType = await this.authService.getUserType(email);
    switch (userType) {
      case UserType.CUSTOMER:
        user = await this.customerService.getCustomer(email);
        break;
      case UserType.ADMIN:
        user = await this.adminService.getAdmin(email);
        break;
      case UserType.PROVIDER:
        user = await this.providerService.getProvider(email);
        break;
      default:
        throw new BadRequestException('Invalid user type');
    }

    if (!user) {
      throw new NotFoundException('Could not find the user');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let latest_device = getDevice(req.headers);
    latest_device += ' - ' + ipAddress.slice(7);
    console.log(latest_device);

    switch (userType) {
      case UserType.CUSTOMER:
        await this.customerService.updateLatestDevice(user.id, latest_device);
        break;
      case UserType.ADMIN:
        await this.adminService.updateLatestDevice(user.id, latest_device);
        break;
      case UserType.PROVIDER:
        await this.providerService.updateLatestDevice(user.id, latest_device);
        break;
      default:
        throw new BadRequestException('Invalid user type');
    }

    const payload = { id: user.id, email: user.email, type: userType };
    const newToken = this.jwtService.sign(payload);
    console.log(payload);
    console.log(newToken);
    this.jwtAuthService.createCookie(req.res, newToken);
    return {
      user,
      msg: 'User logged in',
      isLatestDevice: true,
      access_token: newToken,
    };
  }
  // TODO: create reset password feature
  // generate password reset token
  @Post('/reset-password')
  async generatePasswordResetToken(@Body('email') email: string) {
    await this.authService.sendPasswordResetEmail(email);
    return {
      message: 'Password reset email has been sent to your email address',
    };
  }

  // validate password reset token
  @Get('/reset-password/:token')
  async validatePasswordResetToken(@Param('token') token: string) {
    const isValidToken = await this.authService.validatePasswordResetToken(
      token,
    );
    console.log(isValidToken);

    if (isValidToken) {
      return { message: 'Token is valid' };
    } else {
      throw new BadRequestException('Invalid token');
    }
  }

  // update password using token
  @Put('/reset-password/:token')
  async updatePasswordUsingToken(
    @Param('token') token: string,
    @Body('password') password: string,
    @Body('confirmPassword') confirmPassword: string,
  ) {
    if (password !== confirmPassword) {
      // password and confirm password do not match
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    await this.authService.updatePasswordUsingToken(token, password);
    return { message: 'Your password has been updated' };
  }
}
