import {
  Headers,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  SetMetadata,
  UseGuards,
  ForbiddenException,
  HttpCode,
  ConflictException,
} from '@nestjs/common';
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger'; // Import Swagger decorators
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@ApiTags('Stripe') // Add tags for the API group
@Controller('stripe')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private readonly providersService: ProvidersService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly jwtService: JwtService,
    private readonly locationsService: LocationsService,
    private readonly emailService: EmailService,
  ) {}

  @Post('create-provider-account')
  @ApiOperation({ summary: 'Create a Stripe account for a provider' })
  @ApiResponse({
    status: 403,
    description: 'Only providers can create a stripe account',
  })
  @ApiResponse({
    status: 201,
    description: 'The stripe account has been successfully created',
  })
  async createProviderAccount(
    @Body()
    body: {
      email: string;
      country: string;
      businessType: string;
      companyName: string;
    },
    @Req() req: Request,
  ): Promise<{ accountId: string; accountLinkUrl: string }> {
    const jwtCookie = req.cookies['access_token'];
    const payload = await this.jwtService.verify(jwtCookie);
    const { id, username, type } = payload;

    if (type !== UserType.PROVIDER) {
      throw new ForbiddenException(
        'Only providers can create a stripe account',
      );
    }

    const bType = body.businessType as Stripe.AccountCreateParams.BusinessType;
    const provider = await this.providersService.getProviderById(id);
    if (provider.stripe_account_id) {
      throw new ConflictException('Provider already has a Stripe account');
    }
    const accountId = await this.stripeService.createAccount(
      body.email,
      body.country,
      bType,
      body.companyName,
    );
    const accountLinkUrl = await this.stripeService.createAccountLink(
      accountId,
    );

    await this.providersService.updateStripeAccountId(id, accountId);

    return { accountId, accountLinkUrl };
  }

  @Post('create-checkout-session')
  @ApiOperation({ summary: 'Create a Stripe checkout session' })
  @ApiBody({
    type: CreateCheckoutSessionDto,
    examples: {
      'Create a checkout session with a description': {
        value: {
          location_id: '000000000004000000000001',
          quantity: 3,
          takeReceipt: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The checkout session has been successfully created',
  })
  async createCheckoutSession(
    @Body('location_id') location_id: string,
    @Body('quantity') quantity: number,
    @Body('takeReceipt') takeReceipt: boolean,
  ): Promise<{ url: string }> {
    const provider = await this.providersService.getProviderByLocationId(
      location_id,
    );

    const location = await this.locationsService.getLocationById(location_id);
    const session = await this.stripeService.createCheckoutSession(
      location.stripe_price_id,
      provider.stripe_account_id,
      quantity,
      takeReceipt,
    );

    return { url: session.url };
  }
  @Post('create-product')
  @ApiOperation({ summary: 'Create a product' })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      'Create a product with a description': {
        value: {
          locationId: '000000000004000000000001',
          name: 'product',
          description: 'A description of my product',
          unitAmount: 2000,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created',
  })
  async createProductAndPrice(
    @Body('locationId') locationId: string,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') unitAmount: number,
  ) {
    const { product, price } = await this.stripeService.createProductAndPrice(
      name,
      description,
      unitAmount,
      locationId,
    );
    await this.locationsService.updateStripeLocationProductIdAndPriceId(
      locationId,
      product.id,
      price.id,
    );
    return { product, price };
  }

  @Post('create-coupon')
  @ApiOperation({ summary: 'Create a coupon' })
  @ApiBody({
    type: CreateCouponDto,
    examples: {
      'Create a coupon with a percentOff and maxRedemptions': {
        value: {
          name: 'coupon1',
          percentOff: 50,
          maxRedemptions: 500,
          locationName: 'CU Centenary Park',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The coupon has been successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'The coupon could not be created',
  })
  async createCoupon(
    @Body('name') name: string,
    @Body('amountOff') amountOff: number,
    @Body('percentOff') percentOff: number,
    @Body('maxRedemptions') maxRedemptions: number,
    @Body('locationName') locationName: string,
  ): Promise<{
    statusCode: number;
    coupon: Stripe.Coupon;
    promotionCode: Stripe.PromotionCode;
  }> {
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
}
