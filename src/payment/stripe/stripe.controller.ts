import { Headers, Body, Controller, Get, HttpStatus, Param, Post, Req, Res, SetMetadata, UseGuards, ForbiddenException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { RolesGuard } from 'src/auth/guards/roles.auth.guard';
import { UserType } from 'src/auth/constants';
import { CouponDuration } from './coupon-duration.enum';
import { JwtAuthService } from 'src/auth/jwt.service';
import * as cookieParser from 'cookie-parser';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ProvidersService } from 'src/providers/providers.service';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService,
    private readonly providersService: ProvidersService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtService: JwtService,
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
    

    const accountId = await this.stripeService.createAccount();
    const accountLinkUrl = await this.stripeService.createAccountLink(
      accountId,
    )
    
    await this.providersService.updateStripeAccountId(id, accountId);

    return { accountId, accountLinkUrl };
  }


  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body: { priceId: string, connectedAccountId: string, hour: number }): Promise<{ url: string }> {
    const { priceId, connectedAccountId, hour } = body;

    const session = await this.stripeService.createCheckoutSession(priceId, connectedAccountId, hour);

    return { url: session.url };
  }
  @Post('create-product')
  async createProductAndPrice(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('unitAmount') unitAmount: number,
    @Req() req: Request,
  ) {
    // unit amount is in cents so we multiply by 100
    const jwtCookie = req.cookies['access_token'];
    const payload = await this.jwtService.verify(jwtCookie);
    const { id, username, type } = payload;
    const accountId = await this.providersService.getStripeAccountId(id);
    const { product, price } = await this.stripeService.createProductAndPrice(name, description, unitAmount * 100, accountId);
    return { product, price };
  }

  @Post('create-coupon')
  async createCoupon(
    @Body('percentOff') percentOff: number,
    @Body('duration') duration: string,
    @Body('durationInMonths') durationInMonths: number,
    @Body('productIds') productIds?: string[],
  ): Promise<{ statusCode: number; coupon: Stripe.Coupon }> {
    const durationEnum = this.stripeService.convertToDurationEnum(duration);

    const createdCoupon = await this.stripeService.createCoupon(
      percentOff,
      durationEnum,
      durationInMonths,
      productIds,
    );

    return {
      statusCode: HttpStatus.CREATED,
      coupon: createdCoupon,
    };
  }


}
