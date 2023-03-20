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

  
  async createCheckoutSession(priceId: string, connectedAccountId:string, hour:number): Promise<Stripe.Checkout.Session> {
    
    const price = await this.stripe.prices.retrieve(priceId);
    const applicationFeeAmount = Math.round(price.unit_amount * 0.1); // calculate 10% of the total price

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{price: priceId, quantity: hour}],
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {destination: connectedAccountId},
      },
      success_url: 'http://localhost:3000/me/bookings',
      cancel_url: 'http://localhost:3000/me/bookings',
    });
    return session;
}

  
  async capturePayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.capture(paymentIntentId);
    return paymentIntent;
  }
  
  async createProductAndPrice(name: string, description: string, unitAmount: number, accountId: string): Promise<{ product: Stripe.Product, price: Stripe.Price }> {
    const product = await this.stripe.products.create({
      name,
      description,
      metadata: {
        key: 'value',
      },
    }, {
      stripeAccount: accountId,
    });

    const price = await this.stripe.prices.create({
      product: product.id,
      unit_amount: unitAmount,
      currency: 'thb',
    }, {
      stripeAccount: accountId,
    });

    return { product, price };
  }

  


}
