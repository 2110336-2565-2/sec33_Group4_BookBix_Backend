import { Injectable, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { Location } from './entity/locations.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Time, Review } from './entity/locations.entity';
import { Provider } from 'src/providers/entities/provider.entity';
import { ProvidersService } from 'src/providers/providers.service';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel('locations') private readonly locationModel: Model<Location>,
    @Inject(forwardRef(() => ProvidersService))
    private readonly providersService: ProvidersService,
  ) {}

  async addReview(
    locationId: string,
    title: string,
    username: string,
    rating: number,
    text: string,
    dateCreated: string,
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

  async createLocation(
    providerId: string,
    name: string,
    address: string,
    description: string,
    url: string,
    images: string[],
    reviews: string[],
    time: Time,
    available_days: string[],
    price: number,
    avg_rating: number,
  ) {
    const location = new this.locationModel({
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
    });
    console.log(location._id);
    let provider = await this.providersService.getProviderById(providerId);
    provider.locations.push(location._id);
    await provider.save();
    return location.save();
  }

  async getAllLocations() {
    const locations = await this.locationModel.find();
    return locations.map((location) => ({
      id: location.id,
      name: location.name,
      address: location.address,
      description: location.description,
      url: location.url,
      images: location.images,
      reviews: location.reviews,
      time: location.time,
      available_days: location.available_days,
      price: location.price,
      avg_rating: location.avg_rating,
    }));
  }

  async updateLocation(
    locationId: string,
    name: string,
    address: string,
    description: string,
    url: string,
    images: string[],
    reviews: Review[],
    time: Time,
    available_days: string[],
    price: number,
    avg_rating: number,
  ) {
    const location = await this.locationModel.findById(locationId);
    location.name = name;
    location.address = address;
    location.description = description;
    location.url = url;
    location.images = images;
    location.reviews = reviews;
    location.time = time;
    location.available_days = available_days;
    location.price = price;
    location.avg_rating = avg_rating;
    return location.save();
  }

  async deleteLocation(locationId: string) {
    try {
      const location = await this.locationModel.findById(locationId);
      location.remove();
      // remove location from provider
      let provider = await this.providersService.getAllProviders();
      for (let i = 0; i < provider.length; i++) {
        for (let j = 0; j < provider[i].locations.length; j++) {
          if (provider[i].locations[j] == locationId) {
            provider[i].locations.splice(j, 1);
            await provider[i].save();
          }
        }
      }
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

  async getLocation(
    locationName: string,
    minPrice: number,
    maxPrice: number,
    locationType: string,
    locationFunction: string,
  ) {
    const query: any = {};

    if (locationName) {
      query['name'] = { $regex: new RegExp(locationName, 'i'), $options: 'i' };
    }
    if (locationType) {
      query['type'] = locationType;
    }
    if (locationFunction) {
      query['function'] = locationFunction;
    }
    query['price'] = { $gte: minPrice, $lte: maxPrice };

    const locations = await this.locationModel.find(query);
    return locations;
  }

  async updateStripeLocationProductIdAndPriceId(
    locationId: string,
    productId: string,
    priceId: string,
  ) {
    const filter = { _id: locationId };
    const update = {
      $set: { stripe_prod_id: productId, stripe_price_id: priceId },
    };
    const options = { new: true };
    const location = await this.locationModel.findOneAndUpdate(
      filter,
      update,
      options,
    );
    return location;
  }
  async getLocationById(locationId: string) {
    const location = await this.locationModel.findById(locationId);
    return location;
  }
  async getProductIdByLocationName(locationName: string) {
    const location = await this.locationModel.findOne({ name: locationName });
    return location.stripe_prod_id;
  }
  async getImagesByLocationId(locationId: string) {
    const location = await this.getLocationById(locationId);
    return location.images;
  }
}
