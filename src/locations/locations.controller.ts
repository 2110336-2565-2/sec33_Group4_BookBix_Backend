import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { title } from 'process';
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
}
