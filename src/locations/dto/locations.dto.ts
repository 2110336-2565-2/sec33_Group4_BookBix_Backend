import { Time, Review } from '../entity/locations.entity';

export class ReviewLocationDto {
  title: string;
  username: string;
  rating: number;
  text: string;
}

export class CreateLocationDto {
  name: string;
  address: string;
  description: string;
  url: string;
  images: string[];
  time: Time;
  available_days: string[];
  price: number;
}

export class UpdateLocationDto {
  name: string;
  address: string;
  description: string;
  url: string;
  images: string[];
  reviews: Review[];
  time: Time;
  available_days: string[];
  price: number;
  avg_rating: number;
}
