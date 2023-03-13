import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;

  firstname?: string;
  lastname?: string;
  sex?: string;
  birthdate?: string;
  date_created?: Date;
  latest_device?: string;
  device_history?: string[];
}
