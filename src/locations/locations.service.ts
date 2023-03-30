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

  async createLocation(
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
