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
  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body: { priceId: string }): Promise<any> {
    const session = await this.stripeService.createCheckoutSession(body.priceId);

    return { url: session.url };
  }
  @Post('create-product')
  async createProductAndPrice(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('unitAmount') unitAmount: number,
    @Body('accountId') accountId: string,
  ) {
    // unit amount is in cents so we multiply by 100
    const { product, price } = await this.stripeService.createProductAndPrice(name, description, unitAmount*100, accountId);
    return { product, price };
  }

  
}
