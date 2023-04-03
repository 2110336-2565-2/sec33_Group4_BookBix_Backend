import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ProvidersService } from 'src/providers/providers.service';
import { Request } from 'express';
import { LocationsService } from 'src/locations/locations.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService,
    private readonly providersService: ProvidersService,
    private readonly locationsService: LocationsService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15',
    });
  }

  async createAccount(email: string, country: string, businessType: Stripe.AccountCreateParams.BusinessType, companyName: string
  ): Promise<string> {
    const account = await this.stripe.accounts.create({
      type: 'standard',
      country: country,
      email: email,
      business_type: businessType,
      company: { name: companyName },
    });

    return account.id;
  }


  async createAccountLink(accountId: string): Promise<string> {
    const accountLink = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: 'http://localhost:3000/locations',
      return_url: 'http://localhost:3000/locations',
      type: 'account_onboarding',
    });
    return accountLink.url;
  }


  async createCheckoutSession(priceId: string, connectedAccountId: string, hour: number, takeReceipt: boolean): Promise<Stripe.Checkout.Session> {

    const price = await this.stripe.prices.retrieve(priceId);
    const applicationFeeAmount = hour * Math.round(price.unit_amount * 0.1); // calculate 10% of the total price
    const email = await this.providersService.getProviderEmailByStripeAccountId(connectedAccountId);

    const sessionParams = {
      mode: 'payment',
      line_items: [{ price: priceId, quantity: hour }],
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: { destination: connectedAccountId },
        receipt_email: takeReceipt? email:"se.db.group4@gmail.com",
      },
      success_url: 'http://localhost:3000/me/bookings',
      cancel_url: 'http://localhost:3000/me/bookings',
      allow_promotion_codes: true,
    } as Stripe.Checkout.SessionCreateParams;

    const session = await this.stripe.checkout.sessions.create(sessionParams);
    return session;
  }




  // read more about product and price object
  // product: https://stripe.com/docs/api/products
  // price: https://stripe.com/docs/api/prices
  async createProductAndPrice(name: string, description: string, unitAmount: number, locationId: string): Promise<{ product: Stripe.Product, price: Stripe.Price }> {
    const accountId = process.env.STRIPE_ACCOUNT_ID;
    const images = await this.locationsService.getImagesByLocationId(locationId);

    const product = await this.stripe.products.create({
      name: name,
      description: description,
      images: images,
      metadata: {
        key: 'value',
      },
    }, {
      stripeAccount: accountId,
    });

    const price = await this.stripe.prices.create({
      product: product.id,
      unit_amount: unitAmount * 100, // convert to cent
      currency: 'thb',
    }, {
      stripeAccount: accountId,
    });

    return { product, price };
  }

  // read more about coupon object https://stripe.com/docs/api/coupons/object#coupon_object-duration
  async createCoupon(
    name: string,
    amountOff: number,
    percentOff: number,
    maxRedemptions: number,
    locationName: string,
  ): Promise<Stripe.Coupon> {
    

    const productId = await this.locationsService.getProductIdByLocationName(locationName);
    const coupon = await this.stripe.coupons.create({
      name: name,
      amount_off: amountOff*100,
      percent_off: percentOff,
      currency: 'thb',
      duration: 'once',
      max_redemptions: maxRedemptions,
      applies_to: {
        products: [productId],
      },
    });

    return coupon;
  }


  async constructEvent(req: Request): Promise<Stripe.Event> {
    const webhook = this.stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return webhook;
  }


}
