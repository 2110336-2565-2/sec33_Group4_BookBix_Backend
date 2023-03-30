import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { Time } from './entity/locations.entity';
import { LocationsService } from './locations.service';

@Controller('locations')
export class ReviewsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post(':locationId/reviews')
  async addReview(
    @Param('locationId') locationId: string,
    @Body('title') title: string,
    @Body('username') username: string,
    @Body('rating') rating: number,
    @Body('text') text: string,
  ) {
    if (!username || !rating || !text) {
      throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
    }
    const review = await this.locationsService.addReview(
      locationId,
      title,
      username,
      rating,
      text,
      new Date(),
    );
    this.locationsService.calculateRating(locationId);
    return {
      status: HttpStatus.CREATED,
      msg: 'Review added',
    };
  }

  @Post()
  async createLocation(
    @Body('name') name: string,
    @Body('address') address: string,
    @Body('description') description: string,
    @Body('url') url: string,
    @Body('images') images: string[],
    @Body('time') time: Time,
    @Body('available_days') available_days: string[],
    @Body('price') price: number,
  ) {
    if (
      !name ||
      !address ||
      !description ||
      !url ||
      !images ||
      !time ||
      !available_days ||
      !price
    ) {
      throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
    }
    const location = await this.locationsService.createLocation(
      name,
      address,
      description,
      url,
      images,
      [],
      time,
      available_days,
      price,
      0,
    );
    return {
      status: HttpStatus.CREATED,
      msg: 'Location created',
    };
  }

  //@desc Get all locations
  @Get()
  async getAllLocations() {
    const locations = await this.locationsService.getAllLocations();
    return locations;
  }

  //@desc Get a single location by its id
  @Get(':locationId')
  async getLocation(@Param('locationId') locationId: string) {
    const location = await this.locationsService.getLocation(locationId);
    return location;
  }

  @Put(':locationId')
  async updateLocation(
    @Param('locationId') locationId: string,
    @Body('time') time: Time,
    @Body('available_days') available_days: string[],
  ) {
    if (!time || !available_days) {
      return {
        status: HttpStatus.BAD_REQUEST,
        msg: 'Please provide time or available days',
      };
    }
    const location = await this.locationsService.updateLocation(
      locationId,
      time,
      available_days,
    );
    return {
      status: HttpStatus.OK,
      msg: 'Location updated',
    };
  }

  @Delete(':locationId')
  async deleteLocation(@Param('locationId') locationId: string) {
    const location = await this.locationsService.deleteLocation(locationId);
    return location;
  }
}
