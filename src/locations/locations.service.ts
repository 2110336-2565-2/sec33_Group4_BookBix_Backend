import { Injectable, HttpStatus } from '@nestjs/common';
import { Location } from './entity/locations.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Time } from './entity/locations.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel('locations') private readonly locationModel: Model<Location>,
  ) {}

  async addReview(
    locationId: string,
    title: string,
    username: string,
    rating: number,
    text: string,
    dateCreated: Date,
  ) {
    const location = await this.locationModel.findById(locationId);
    location.reviews.push({ title, username, rating, text, dateCreated });
    return location.save();
  }

  async calculateRating(locationId: string) {
    const location = await this.locationModel.findById(locationId);
    const totalRating = location.reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0);
    location.avg_rating = totalRating / location.reviews.length;
    return location.save();
  }

  async updateLocation(
    locationId: string,
    time: Time,
    available_days: string[],
  ) {
    const location = await this.locationModel.findById(locationId);
    if (!location) {
      return {
        status: HttpStatus.NOT_FOUND,
        msg: 'Location not found',
      };
    }
    location.time.open_time = time.open_time;
    location.time.close_time = time.close_time;
    location.available_days = available_days;
    return location.save();
  }

  async deleteLocation(locationId: string) {
    try {
      const location = await this.locationModel.findById(locationId);
      location.remove();
      return {
        status: HttpStatus.OK,
        msg: 'Location deleted',
      };
    } catch (err) {
      return {
        status: HttpStatus.NOT_FOUND,
        msg: 'Location not found',
      };
    }
  }
}
