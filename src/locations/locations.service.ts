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
  async updateStripeLocationProductIdAndPriceId(locationId: string, productId: string, priceId: string) {
    const filter = { _id: locationId };
    const update = { $set: { stripe_prod_id: productId, stripe_price_id: priceId } };
    const options = { new: true };
    const location = await this.locationModel.findOneAndUpdate(filter, update, options);
    return location;

  }
  async getLocationById(locationId: string){
    const location = await this.locationModel.findById(locationId);
    return location;
  }
  async getProductIdByLocationName(locationName: string){
    const location = await this.locationModel.findOne({name: locationName});
    return location.stripe_prod_id;
  }
  async getImagesByLocationId(locationId: string){
    const location = await this.getLocationById(locationId);
    return location.images;
  }
}
