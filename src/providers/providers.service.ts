import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';
import { ObjectId } from 'mongodb';
import { Location } from 'src/locations/entity/locations.entity';
import { LocationsService } from 'src/locations/locations.service';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel('providers') private readonly providerModel: Model<Provider>,
    @Inject(forwardRef(() => LocationsService))
    private readonly locationsService: LocationsService,
  ) {}

  async insertNewProvider(createProviderDto: CreateProviderDto) {
    const newProvider = new this.providerModel(createProviderDto);
    await newProvider.save();
    return newProvider;
  }

  async getProvider(email: string) {
    const provider = await this.providerModel.findOne({ email });
    return provider;
  }

  async updateLatestDevice(providerId: string, latest_device: string) {
    const provider = await this.providerModel.findById(providerId);
    provider.latest_device = latest_device;
    provider.device_history.push(latest_device);
    await provider.save();
    return provider;
  }

  async getProviderById(providerId: string) {
    const provider = await this.providerModel.findById(providerId);
    return provider;
  }
  async getProviderByEmail(email: string) {
    const provider = await this.providerModel.findOne({ email });
    return provider;
  }

  async updateStripeAccountId(
    providerId: string,
    accountId: string,
  ): Promise<Provider> {
    const filter = { _id: providerId };
    const update = { $set: { stripe_account_id: accountId } };
    const options = { new: true };
    const provider = await this.providerModel.findOneAndUpdate(
      filter,
      update,
      options,
    );
    return provider;
  }
  async getStripeAccountId(providerId: string): Promise<string> {
    const provider = await this.providerModel.findById(providerId);
    return provider.stripe_account_id;
  }
  async getProviderEmailByStripeAccountId(
    stripeAccountId: string,
  ): Promise<string> {
    const provider = await this.providerModel.findOne({
      stripe_account_id: stripeAccountId,
    });
    return provider.email;
  }
  async getLocationsByProviderId(providerId: string) {
    try {
      const provider = await this.providerModel.findById(providerId);
      let result = [];
      for (let i = 0; i < provider.locations.length; i++) {
        let location = await this.locationsService.getLocationById(
          provider.locations[i],
        );
        result.push(location);
      }
      return result;
    } catch (error) {
      return {
        status: 404,
        msg: 'Provider not found',
      };
    }
  }
  async getAllProviders() {
    const providers = await this.providerModel.find();
    return providers;
  }
  async getProviderByLocationId(locationId: string) {
    const providers = await this.providerModel.aggregate([
      { $match: { locations: new ObjectId(locationId) } },
    ]);
    console.log(providers);

    if (!providers) {
      throw new Error(`Provider not found for location ID: ${locationId}`);
    }

    return await providers[0]; // there should only be one provider per location
  }

  async getHistory(customerId: string) {
    const customer = await this.providerModel.findById(customerId);
    return customer.device_history.reverse();
  }
}
