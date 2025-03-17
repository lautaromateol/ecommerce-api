import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { StripeService } from "./stripe.service";
import { CreatePaymentSessionDto } from "./dtos/create-payment-session.dto";

@Controller("stripe")
export class StripeController {
  constructor(
    private readonly stripeService: StripeService
  ) {}

  @Post("create-payment-session")
  @UseGuards(AuthGuard)
  async createPaymentSession(@Body() order: CreatePaymentSessionDto) {
    const session = await this.stripeService.createPaymentSession(order)

    return session
  }

  @Get("get-session-details/:session_id")
  async getSessionDetails(@Param("session_id") sessionId: string) {
    const session = await this.stripeService.getSessionDetails(sessionId)

    return session
  }

  @Post("webhook")
  async webhook(@Req() request: Request) {
    const payload = await request.text()
    const sig = request.headers.get("stripe_signature") as string

    const order = await this.stripeService.webhook(payload, sig)

    return order
  }

}