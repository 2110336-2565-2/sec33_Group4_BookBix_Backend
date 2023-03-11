import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class ReviewsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post(':locationId/reviews')
  async addReview(
    @Param('locationId') locationId: string,
    @Body('username') username: string,
    @Body('rating') rating: number,
    @Body('text') text: string,
  ) {
    console.log('longdo');
    if (!username || !rating || !text) {
      throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
    }
    const review = await this.locationsService.addReview(
      locationId,
      username,
      rating,
      text,
    );
    return {
      status: HttpStatus.CREATED,
      msg: 'Review added',
    };
  }
}
