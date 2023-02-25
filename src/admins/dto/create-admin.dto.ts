import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  email: string;

  date_created: Date;
}
