import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  description: string;

  @IsString()
  url: string;

  @IsArray()
  images: string[];

  @IsArray()
  reviews: string[];

  @IsOptional()
  time: {
    start: string;
    end: string;
  };

  @IsArray()
  available_days: string[];
}
