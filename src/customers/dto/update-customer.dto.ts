import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateCustomerDto {
  firstname: string;

  lastname: string;

  sex: string;

  birthdate: string;

  @IsEmail()
  email: string;
}
