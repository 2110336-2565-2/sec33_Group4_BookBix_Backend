import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  reviews?: string[];

  @IsOptional()
  time?: {
    start: string;
    end: string;
  };

  @IsOptional()
  @IsArray()
  available_days?: string[];
}
