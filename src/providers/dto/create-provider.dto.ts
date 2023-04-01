import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProviderDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  latest_device: string;

  @IsNotEmpty()
  date_created: Date;

  @IsString()
  organization_name: string;

  locations: any[]; // this field is left as an any type, as it's unclear what type it should be

  @IsString()
  stripe_account_id?: string;
}
