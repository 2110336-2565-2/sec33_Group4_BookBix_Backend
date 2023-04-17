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
import { BookingsService } from 'src/bookings/bookings.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger'; // Import Swagger decorators
import {
  ReviewLocationDto,
  CreateLocationDto,
  UpdateLocationDto,
} from './dto/locations.dto';

function formatDate(dateString) {
  const date = new Date(dateString);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  return `${day} ${months[monthIndex]} ${year}`;
}

@ApiTags('Locations') // Add tags for the API group
@Controller('locations')
export class ReviewsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly bookingsService: BookingsService,
  ) {}

  @Post(':locationId/reviews')
  @ApiOperation({ summary: 'Add review to location' })
  @ApiResponse({ status: 201, description: 'Review added' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: ReviewLocationDto })
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
    let date = new Date();
    let formattedDate = formatDate(date);
    console.log(`formattedDate: ${formattedDate}`);
    const review = await this.locationsService.addReview(
      locationId,
      title,
      username,
      rating,
      text,
      formattedDate,
    );
    this.locationsService.calculateRating(locationId);
    return {
      status: HttpStatus.CREATED,
      msg: 'Review added',
    };
  }

  @ApiOperation({ summary: 'Search for locations' }) // Add Swagger operation description
  @ApiQuery({ name: 'location_name', required: false }) // Add Swagger query parameter description
  @ApiQuery({ name: 'min_price', type: 'number', required: false }) // Add Swagger query parameter description
  @ApiQuery({ name: 'max_price', type: 'number', required: false }) // Add Swagger query parameter description
  @ApiQuery({ name: 'location_type', required: false }) // Add Swagger query parameter description
  @ApiQuery({ name: 'location_function', required: false }) // Add Swagger query parameter description
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' }) // Add Swagger response description
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' }) // Add Swagger response description
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
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, description: 'Location created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateLocationDto })
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
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async getAllLocations() {
    const locations = await this.locationsService.getAllLocations();
    return locations;
  }

  //@desc Get a single location by its id
  @Get(':locationId')
  @ApiOperation({ summary: 'Get a location by its id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async getLocation(@Param('locationId') locationId: string) {
    const location = await this.locationsService.getLocationById(locationId);
    return location;
  }

  @Put(':locationId')
  @ApiOperation({ summary: 'Update a location' })
  @ApiResponse({ status: 201, description: 'Location updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: UpdateLocationDto })
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
  @ApiOperation({ summary: 'Delete a location' })
  @ApiResponse({ status: 201, description: 'Location deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async deleteLocation(@Param('locationId') locationId: string) {
    const location = await this.locationsService.deleteLocation(locationId);
    return location;
  }

  @Get(':locationId/bookings')
  @ApiOperation({ summary: 'Get all bookings of a location' })
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async getUnavailableTimeslot(@Param('locationId') locationId: string) {
    const result = await this.bookingsService.getUnavailableTimeslot(
      locationId,
    );

    return {
      msg: 'Successfully get unavailable timeslot',
      time_list: result,
    };
  }
}
