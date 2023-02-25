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
  ) {
    if (userType === UserType.CUSTOMER) {
      const customer = await this.authService.registerCustomer(
        email,
        username,
        password,
      );
      const payload = {
        username: customer.username,
        sub: customer._id,
        type: UserType.CUSTOMER,
      };
      return {
        msg: 'Customer successfully registered',
        access_token: await this.authService.generateToken(payload),
      };
    } else if (userType === UserType.ADMIN) {
      const admin = await this.authService.registerAdmin(username, password);
      const payload = {
        username: admin.username,
        sub: admin._id,
        type: UserType.ADMIN,
      };
      return {
        msg: 'Admin successfully registered',
        access_token: this.authService.generateToken(payload),
      };
    } else if (userType === UserType.PROVIDER) {
      const provider = await this.authService.registerProvider(
        username,
        password,
      );
      // TODO: after TODO3 and TODO4 uncomment registerProvider function
      const payload = {
        username: provider.username,
        sub: provider._id,
        type: UserType.PROVIDER,
      };
      return {
        msg: 'Provider successfully registered',
        access_token: this.authService.generateToken(payload),
      };
      // TODO: after TODO3 and TODO4 in auth.service.ts uncomment if else case above
    } else {
      return {
        msg: 'Invalid user type',
      };
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    let user: any;
    const { email, password } = req.body;
    const token = req.cookies['access_token'];
    const decoded: any = this.jwtService.decode(token);

    if (!decoded || !decoded.type) {
      throw new UnauthorizedException('Invalid token');
    }

    const userType = decoded.type;
    switch (userType) {
      case UserType.CUSTOMER:
        user = await this.customerService.getCustomer(email);
        break;
      // case UserType.ADMIN:
      //   user = await this.adminService.getAdmin(email); // TODO5: write adminService.getAdmin()
      //   break;
      // case UserType.PROVIDER:
      //   user = await this.providerService.getProvider(email); // TODO6: write providerService.getProvider()
      //   break;
      // TODO: after TODO5 and TODO6 uncomment case above
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

    const latest_device = getDevice(req.headers);
    if (user.latest_device !== latest_device && user.latest_device !== '') {
      console.log(user.latest_device);
      return { isLatestDevice: false };
    }

    switch (userType) {
      case UserType.CUSTOMER:
        await this.customerService.updateLatestDevice(user.id, latest_device);
        break;
      // case UserType.ADMIN:
      //   await this.adminService.updateLatestDevice(user.id, latest_device); // TODO7: write adminService.updateLatestDevice()
      //   break;
      // case UserType.PROVIDER:
      //   await this.providerService.updateLatestDevice(user.id, latest_device); // TODO8: write providerService.updateLatestDevice()
      //   break;
      // TODO: after TODO7 and TODO8 uncomment case above
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
  // // generate password reset token
  // @Post('/resetpassword')
  // async generatePasswordResetToken(@Body('email') email: string) {
  //   return await this.authService.generatePasswordResetToken(email);
  // }

  // // validate password reset token
  // @Get('/resetpassword/:token')
  // async validatePasswordResetToken(@Param('token') token: string) {
  //   return await this.authService.validatePasswordResetToken(token);
  // }

  // // update password using token
  // @Put('/resetpassword/:token')
  // async updatePasswordUsingToken(
  //   @Param('token') token: string,
  //   @Body('password') password: string,
  //   @Body('confirmPassword') confirmPassword: string,
  // ) {
  //   if (password !== confirmPassword) {
  //     // password and confirm password do not match
  //     throw new BadRequestException(
  //       'Password and confirm password do not match',
  //     );
  //   }

  //   return await this.authService.updatePasswordUsingToken(token, password);
  }
}
