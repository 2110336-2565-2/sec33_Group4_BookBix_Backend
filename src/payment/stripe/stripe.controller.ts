import { Body, Controller, Get, Param, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { RolesGuard } from 'src/auth/guards/roles.auth.guard';
import { UserType } from 'src/auth/constants';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('create-account')
  async createAccount(
    @Body()
    body: {
      email: string;
      country: string;
      businessType: string;
      companyName: string;
    },
  ): Promise<{ accountId: string; accountLinkUrl: string }> {
    const accountId = await this.stripeService.createAccount();
    const accountLinkUrl = await this.stripeService.createAccountLink(
      accountId,
    );

    return { accountId, accountLinkUrl };
  }
  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; accountId: string },
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      body.amount,
      body.accountId,
    );
    return paymentIntent;
  }
  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body: { priceId: string }): Promise<any> {
    const session = await this.stripeService.createCheckoutSession(body.priceId);

    return { url: session.url };
  }

  @Get('capture-payment/:id')
  async capturePayment(
    @Param('id') paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripeService.capturePayment(
      paymentIntentId,
    );
    return paymentIntent;
  }
}
