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
  
  async createCheckoutSession(priceId: string, accountId: string): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{price: priceId, quantity: 1}],
      payment_intent_data: {
        application_fee_amount: 123,
        transfer_data: {destination: accountId},
      },
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    return session;
  }
  async capturePayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.capture(paymentIntentId);
    return paymentIntent;
  }
}
