import { Controller, Post, Body, Req, UseGuards, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { defineCustomerAbilities } from '../customer/abilities/customer.ability';
import { defineProviderAbilities } from '../provider/abilities/provider.ability';
import { defineAdminAbilities } from '../admin/abilities/admin.ability';

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      // return error message
    }
    const token = this.authService.generateJwtToken(user);
    const abilities = this.getAbilities(user.role, user);
    if (user.role === 'customer') {
      return { redirect: '/customer/profile', token };
    } else if (user.role === 'provider') {
      return { redirect: '/provider/profile', token };
    } else if (user.role === 'admin') {
      return { redirect: '/admin/profile', token };
    }
  }

  getAbilities(role: string, user: any) {
    if (role === 'customer') {
      return defineCustomerAbilities(user);
    } else if (role === 'provider') {
      return defineProviderAbilities(user);
    } else if (role === 'admin') {
      return defineAdminAbilities(user);
    }
  }


}
