import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { RolesGuard } from 'src/auth/guards/roles.auth.guard';
import { UserType } from 'src/auth/constants';
import stripe from 'stripe';
import { EmailService } from 'src/email/email.service';


@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService,
    private readonly emailService: EmailService,
  ) { }

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
