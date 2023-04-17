import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserType } from '../constants';

export class RegisterDto {
  username: string;
  email: string;
  password: string;
  userType: UserType;
}
