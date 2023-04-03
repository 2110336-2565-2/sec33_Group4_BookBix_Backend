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
  Query,
} from '@nestjs/common';
import { Review, Time } from './entity/locations.entity';
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

  @Get('/search')
  async search(
    @Query('location_name') location_name: string,
    @Query('min_price') min_price: number,
    @Query('max_price') max_price: number,
    @Query('location_type') location_type: string,
    @Query('location_function') location_function: string,
  ) {
    if (!location_name) {
      location_name = '';
    }
    if (!location_type) {
      location_type = '';
    }
    if (!location_function) {
      location_function = '';
    }
    try {
      const location = await this.locationsService.getLocation(
        location_name,
        min_price,
        max_price,
        location_type,
        location_function,
      );
      return {
        status: HttpStatus.OK,
        location,
      };
    } catch (err) {
      return {
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Post()
  async createLocation(
    @Body('providerId') providerId: string,
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
      !providerId ||
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
      providerId,
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
    const location = await this.locationsService.getLocationById(locationId);
    return location;
  }

  @Put(':locationId')
  async updateLocation(
    @Param('locationId') locationId: string,
    @Body('name') name: string,
    @Body('address') address: string,
    @Body('description') description: string,
    @Body('url') url: string,
    @Body('images') images: string[],
    @Body('reviews') reviews: Review[],
    @Body('time') time: Time,
    @Body('available_days') available_days: string[],
    @Body('price') price: number,
    @Body('avg_rating') avg_rating: number,
  ) {
    if (
      !name ||
      !address ||
      !description ||
      !url ||
      !images ||
      !reviews ||
      !time ||
      !available_days ||
      !price
    ) {
      throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
    }
    const location = await this.locationsService.updateLocation(
      locationId,
      name,
      address,
      description,
      url,
      images,
      reviews,
      time,
      available_days,
      price,
      avg_rating,
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
