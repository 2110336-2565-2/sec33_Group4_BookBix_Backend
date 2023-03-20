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
    let location;
    if(locationName == '' && locationType == '' && locationFunction == ''){
      location = await this.locationModel.find({ 'price': {$gte: minPrice, $lte: maxPrice} });
      return location;
    }else if(locationName !== '' && locationType == '' && locationFunction == ''){
      location = await this.locationModel.find({
        'name': locationName, 
        'price':{$gte: minPrice, $lte: maxPrice}
      });
      return location;
    }else if(locationName == '' && locationType !== '' && locationFunction == ''){
      location = await this.locationModel.find({ 
        'price':  {$gte: minPrice, $lte: maxPrice},
        'type': locationType
      });
      return location;
    }else if(locationName == '' && locationType == '' && locationFunction !== ''){
      location = await this.locationModel.find({ 
        'price': {$gte: minPrice, $lte: maxPrice},
        'function': locationFunction
      });
      return location;
    }else if(locationName !== '' && locationType !== '' && locationFunction == ''){
      location = await this.locationModel.find({ 
        'name': locationName, 
        'price': {$gte: minPrice, $lte: maxPrice},
        'type': locationType
      });
      return location;
    }else if(locationName !== '' && locationType == '' && locationFunction !== ''){
      location = await this.locationModel.find({ 
        'name': locationName, 
        'price': {$gte: minPrice, $lte: maxPrice},
        'function': locationFunction
      });
      return location;
    }else if(locationName == '' && locationType !== '' && locationFunction !== ''){
      location = await this.locationModel.find({ 
        'price': {$gte: minPrice, $lte: maxPrice}, 
        'type': locationType, 
        'function': locationFunction 
      });
      return location;
    }else{
      location = await this.locationModel.find({ 
        'name': locationName, 
        'price':  {$gte: minPrice, $lte: maxPrice},
        'type': locationType,
        'function': locationFunction
      });
      return location;
    }
  }
}
