import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';

@Injectable()
export class ProvidersService {

  constructor(
    @InjectModel('providers') private readonly providerModel: Model<Provider>,
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

  async updateStripeAccountId(providerId: string, accountId: string): Promise<Provider> {
    const filter = { _id: providerId };
    const update = { $set: { stripe_account_id: accountId } };
    const options = { new: true };
    const provider = await this.providerModel.findOneAndUpdate(filter, update, options);
    return provider;
  }
  async getStripeAccountId(providerId: string): Promise<string> {
    const provider = await this.providerModel.findById(providerId);
    return provider.stripe_account_id;
  }
  async getProviderEmailByStripeAccountId(stripeAccountId: string): Promise<string> {
    const provider = await this.providerModel.findOne({ stripe_account_id: stripeAccountId });
    return provider.email;
  }
}
