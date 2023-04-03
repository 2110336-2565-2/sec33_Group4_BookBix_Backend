import { Injectable } from '@nestjs/common';
import { Location } from './entity/locations.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { min } from 'rxjs';

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

  async getLocation(locationName: string, minPrice: number, maxPrice: number, locationType: string, locationFunction: string){
    const query = {};
    
    if(locationName !== undefined && locationName !=='') query['name'] = {$regex: new RegExp(locationName, 'i'), $options: 'i'};
    if(locationType !== undefined && locationType !== '') query['type'] = locationType;
    if(locationFunction !== undefined && locationFunction !== '') query['function'] = locationFunction;

    query['price'] = {$gte: minPrice, $lte: maxPrice};

    const location = await this.locationModel.find(query);
    return location
  }
}
