import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { Location } from './entities/location.entity';
import { UpdateLocationDto } from './dto/update-location.dto';
import { StripeService } from '../payment/stripe/stripe.service';
@Injectable()
export class LocationService {
  constructor(
    @InjectModel('Locations') private locationModel: Model<Location>,
    private stripeService: StripeService,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const { name, address, description, url, images, reviews, time, available_days } = createLocationDto;

    const product = await this.stripeService.createProduct(name);
    const price = await this.stripeService.createPrice(2000, 'thb', product.id);

    const createdLocation = new this.locationModel({
      name,
      address,
      description,
      url,
      images,
      reviews,
      time: time,
      availableDays: available_days,
      productId: product.id,
      priceId: price.id,
    });

    return createdLocation.save();
  }

  findAll() {
    return `This action returns all location`;
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
