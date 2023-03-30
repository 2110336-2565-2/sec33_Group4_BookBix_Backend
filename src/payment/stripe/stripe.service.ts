import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15',
    });
  }

  async createAccount(
  ): Promise<string> {
    const account = await this.stripe.accounts.create({
      type: 'standard',
    });
    console.log(account);
    
    return account.id;
  }
  

  async createAccountLink(accountId: string): Promise<string> {
    const accountLink = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: 'http://localhost:3000/stripe/refresh',
      return_url: 'http://localhost:3000/stripe/return',
      type: 'account_onboarding',
    });
    return accountLink.url;
  }

  async createPaymentIntent(amount: number, accountId: string): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount,
      currency: 'thb',
      application_fee_amount: Math.floor(amount * 0.1), // Collect a 10% platform fee on the payment
      transfer_data: {
        destination: accountId,
      },
    });
    return paymentIntent;
  }
  
  async createCheckoutSession(priceId: string): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: 'http://localhost:3000/me/bookings',
      cancel_url: 'http://localhost:3000/me/bookings',
    });
  
    return session;
  }
  
  async capturePayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.capture(paymentIntentId);
    return paymentIntent;
  }
  
  async createProduct(name: string): Promise<Stripe.Product> {
    const product = await this.stripe.products.create({
      name: name,
    });
    return product;
  }

  

  async getProduct(productId: string): Promise<Stripe.Product> {
    const product = await this.stripe.products.retrieve(productId);
    return product;
  }

  async updateProduct(productId: string, metadata: Stripe.MetadataParam): Promise<Stripe.Product> {
    const product = await this.stripe.products.update(productId, { metadata });
    return product;
  }

  async listProducts(limit: number): Promise<Stripe.ApiList<Stripe.Product>> {
    const products = await this.stripe.products.list({
      limit,
    });
    return products;
  }

  async deleteProduct(productId: string): Promise<Stripe.DeletedProduct> {
    const deletedProduct = await this.stripe.products.del(productId);
    return deletedProduct;
  }

  
  async createPrice(amount: number, currency: string, productId: string): Promise<Stripe.Price> {
    const price = await this.stripe.prices.create({
      unit_amount: amount,
      currency,
      product: productId,
    });
    return price;
  }

  async getPrice(priceId: string): Promise<Stripe.Price> {
    const price = await this.stripe.prices.retrieve(priceId);
    return price;
  }

  async updatePrice(priceId: string, metadata: Stripe.MetadataParam): Promise<Stripe.Price> {
    const price = await this.stripe.prices.update(priceId, { metadata });
    return price;
  }

  async listPrices(limit: number): Promise<Stripe.ApiList<Stripe.Price>> {
    const prices = await this.stripe.prices.list({
      limit,
    });
    return prices;
  }


}
