import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger'; // Import Swagger decorators
@ApiTags('Providers') // Add tags for the API group
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}
  @Get('locations/:providerId')
  @ApiOperation({ summary: 'Get locations by provider id' })
  async getLocationsByProvideId(@Param('providerId') providerId: string) {
    return this.providersService.getLocationsByProviderId(providerId);
  }
}
