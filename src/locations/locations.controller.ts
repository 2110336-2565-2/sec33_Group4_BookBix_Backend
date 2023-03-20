import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { stringify } from 'querystring';
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
    if (!username || !rating || !text) {
      throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
    }
    const review = await this.locationsService.addReview(
      locationId,
      username,
      rating,
      text,
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
    @Query('location_function') location_function: string
  ){
    if(!location_name){
      location_name = '';
    }
    if(!location_type){
      location_type= '';
    }
    if(!location_function){
      location_function = '';
    }
    try{
      const location = await this.locationsService.getLocation(
        location_name, 
        min_price, 
        max_price, 
        location_type, 
        location_function
        );
      return {
        status: HttpStatus.OK,
        location
      }
    }catch(err){
      return {
        status: HttpStatus.BAD_REQUEST,
      }
    }
  }
}
