import { Headers, Body, Controller, Get, HttpStatus, Param, Post, Req, Res, SetMetadata, UseGuards, ForbiddenException, HttpCode, ConflictException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { RolesGuard } from 'src/auth/guards/roles.auth.guard';
import { UserType } from 'src/auth/constants';
import { JwtAuthService } from 'src/auth/jwt.service';
import * as cookieParser from 'cookie-parser';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ProvidersService } from 'src/providers/providers.service';
import { LocationsService } from 'src/locations/locations.service';
import stripe from 'stripe';
import { EmailService } from 'src/email/email.service';



@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService,
    private readonly providersService: ProvidersService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtService: JwtService,
    private readonly locationsService: LocationsService,
    private readonly emailService: EmailService,
  ) { }


  @Post('create-provider-account')
  async createProviderAccount(
    @Body()
    body: {
      email: string;
      country: string;
      businessType: string;
      companyName: string;
    },
    @Req() req: Request
  ): Promise<{ accountId: string; accountLinkUrl: string }> {
    const jwtCookie = req.cookies['access_token'];
    const payload = await this.jwtService.verify(jwtCookie);
    const { id, username, type } = payload;


    if (type !== UserType.PROVIDER) {
      throw new ForbiddenException('Only providers can create a stripe account');
    }
    
    const bType = body.businessType as Stripe.AccountCreateParams.BusinessType;
    const provider = await this.providersService.getProviderById(id);
    if (provider.stripe_account_id) {
      throw new ConflictException('Provider already has a Stripe account');
    }
    const accountId = await this.stripeService.createAccount(body.email, body.country, bType, body.companyName);
    const accountLinkUrl = await this.stripeService.createAccountLink(
      accountId,
    )

    await this.providersService.updateStripeAccountId(id, accountId);

    return { accountId, accountLinkUrl };
  }


  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body('location_id') location_id: string,
    @Body('quantity') quantity: number,
    @Body('takeReceipt') takeReceipt: boolean): Promise<{ url: string }> {

    const provider = await this.providersService.getProviderByLocationId(location_id);
    console.log(provider);
    
    const location = await this.locationsService.getLocationById(location_id);
    const session = await this.stripeService.createCheckoutSession(location.stripe_price_id, provider.stripe_account_id, quantity, takeReceipt);
    
    return { url: session.url };
  }
  @Post('create-product')
  async createProductAndPrice(
    @Body('locationId') locationId: string,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') unitAmount: number,
  ) {
    const { product, price } = await this.stripeService.createProductAndPrice(name, description, unitAmount, locationId);
    await this.locationsService.updateStripeLocationProductIdAndPriceId(locationId, product.id, price.id);
    return { product, price };
  }

  @Post('create-coupon')
  async createCoupon(
    @Body('name') name: string,
    @Body('amountOff') amountOff: number,
    @Body('percentOff') percentOff: number,
    @Body('maxRedemptions') maxRedemptions: number,
    @Body('locationName') locationName: string,
  ): Promise<{ statusCode: number; coupon: Stripe.Coupon; promotionCode: Stripe.PromotionCode }> {
    
    const { coupon, promotionCode } = await this.stripeService.createCoupon(
      name,
      amountOff,
      percentOff,
      maxRedemptions,
      locationName,
    );

    return {
      statusCode: HttpStatus.CREATED,
      coupon,
      promotionCode,
    };
  }



  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() payload: any): Promise<any> {
    let event;

    // Verify the event if you have an endpoint secret defined
    if (process.env.STRIPE_ENDPOINT_SECRET) {
      try {
        event = this.stripeService.constructEvent(payload);
      } catch (err) {
        console.log('⚠️ Webhook signature verification failed.', err.message);
        return;
      }
    } else {
      event = payload;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const checkout = event.data.object as Stripe.Checkout.Session;
        // console.log(checkout);
        const email = event.data.object.customer_details.email;
        const emailSubject = 'Order Notification';
        const emailBody = 'Your order has been placed successfully!';
        await this.emailService.sendEmail(email, emailSubject, emailBody);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
        break;
    }

    // Return a 200 response to acknowledge receipt of the event
    return;
  }
}
