import { Injectable } from '@nestjs/common';
import { Location } from './entity/locations.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel('locations') private readonly locationModel: Model<Location>,
  ) {}

  async addReview(
    locationId: string,
    username: string,
    rating: number,
    text: string,
  ) {
    console.log('longdo2');
    const location = await this.locationModel.findById(locationId);
    location.reviews.push({ username, rating, text });
    return location.save();
  }
}
