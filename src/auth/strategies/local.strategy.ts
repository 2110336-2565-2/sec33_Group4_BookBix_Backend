import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserType } from '../constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string, userType: UserType): Promise<any> {
    //change username to lower case
    console.log(email, password, userType);
    
    const user = await this.authService.validateUser(email, password, userType);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; 
  }
} 
