/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Stripe from "stripe";
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { OrdersService } from "../orders/order.service";
import { CreatePaymentSessionDto } from "./dtos/create-payment-session.dto";

@Injectable()
export class StripeService {
  private stripe: Stripe

  constructor(
    @Inject("STRIPE_API_KEY")
    private readonly apiKey: string,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService

  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: "2025-02-24.acacia"
    })
  }

  async createPaymentSession(order: CreatePaymentSessionDto) {
    const user = await this.usersService.getUser(order.userId);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    if (!order.products || !Array.isArray(order.products)) {
      throw new BadRequestException("Invalid products array.");
    }

    for (const item of order.products) {
      if (!item.id || !item.quantity) {
        throw new BadRequestException("Each product must have an id and quantity.");
      }
    }

    try {
      const lineItems = await Promise.all(
        order.products.map(async (item) => {
          const product = await this.productsService.getProduct(item.id);

          if (!product) {
            console.warn(`Product not found: ${item.id}`);
            return null;
          }

          const unitAmount = Math.round(product.price * 100);

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                images: [product.imgUrl]
              },
              unit_amount: unitAmount
            },
            quantity: item.quantity
          };
        })
      );

      const validLineItems = lineItems.filter(item => item !== null);

      const cartItems = order.products.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));

      const metadata = {
        cartItems: JSON.stringify(cartItems),
        userId: user.id
      };


      const session = await this.stripe.checkout.sessions.create({
        success_url: `${process.env.DOMAIN}/success/{CHECKOUT_SESSION_ID}`,
        client_reference_id: user.id,
        line_items: validLineItems,
        mode: "payment",
        payment_method_types: ["card"],
        payment_intent_data: {
          metadata
        },
        shipping_address_collection: {
          allowed_countries: ["US"]
        },
        customer_email: user.email
      });

      return session;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("There was an error creating the order.");
    }
  }

  async getSessionDetails(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items", "customer_details"] })

    if (!session) {
      throw new BadRequestException("Session payment intent not found.")
    }

    return session
  }

  async webhook(payload: string, sig: string) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case "charge.succeeded":
        {
          const chargeSucceeded = event.data.object

          const { id, ...rest } = chargeSucceeded

          const payment_intent = rest.payment_intent as string
          const receipt_url = rest.receipt_url as string

          type CartItems = {
            id: string;
            quantity: number;
          }[]

          const cartItems: CartItems = JSON.parse(chargeSucceeded.metadata.cartItems)

          const products = (await this.productsService.getProductsByIds(cartItems)).map((item) => {
            if (!cartItems.some((cartItem) => cartItem.id === item.id)) return null

            return {
              id: item.id,
              title: item.name,
              slug: item.slug,
              price: item.price,
              image: item.imgUrl,
              quantity: cartItems.find((cartItem) => item.id === cartItem.id)!.quantity
            }
          }).filter((item) => item !== null)

          await this.ordersService.addOrder({
            ...rest,
            payment_intent,
            receipt_url, 
            chargeId: id,
            cartItems: products,
            userId: chargeSucceeded.metadata.userId
          })
        }
    }
  }
}