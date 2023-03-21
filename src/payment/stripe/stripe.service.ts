import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CouponDuration } from './coupon-duration.enum';

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


  async createCheckoutSession(priceId: string, connectedAccountId: string, hour: number): Promise<Stripe.Checkout.Session> {

    const price = await this.stripe.prices.retrieve(priceId);
    const applicationFeeAmount = Math.round(price.unit_amount * 0.1); // calculate 10% of the total price

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: hour }],
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: { destination: connectedAccountId },
      },
      success_url: 'http://localhost:3000/me/bookings',
      cancel_url: 'http://localhost:3000/me/bookings',
      allow_promotion_codes: true,
    });
    return session;
  }


  async capturePayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.capture(paymentIntentId);
    return paymentIntent;
  }

  // read more about product and price object
  // product: https://stripe.com/docs/api/products
  // price: https://stripe.com/docs/api/prices
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

  // read more about coupon object https://stripe.com/docs/api/coupons/object#coupon_object-duration
  async createCoupon(
    percentOff: number,
    duration: string,
    durationInMonths: number,
    productIds?: string[]
  ): Promise<Stripe.Coupon> {
    const durationEnum = this.convertToDurationEnum(duration);
    const coupon = await this.stripe.coupons.create({
      percent_off: percentOff,
      duration: durationEnum,
      duration_in_months: durationInMonths,
      applies_to: {
        products: productIds,
      },
    });

    return coupon;
  }


  convertToDurationEnum(duration: string): CouponDuration {
    const durationEnum = CouponDuration[duration.toUpperCase() as keyof typeof CouponDuration];

    if (!durationEnum) {
      throw new BadRequestException(`Invalid duration: ${duration}`);
    }

    return durationEnum;
  }


}
