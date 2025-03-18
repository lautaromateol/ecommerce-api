/* eslint-disable @typescript-eslint/no-unsafe-return */
import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ProductsModule } from "../products/products.module";
import { OrderModule } from "../orders/order.module";
import { UsersModule } from "../users/users.module";
import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      controllers: [StripeController],
      imports: [ConfigModule.forRoot(), ProductsModule, UsersModule, OrderModule],
      providers: [
        StripeService,
        {
          provide: "STRIPE_API_KEY",
          useFactory: (configService: ConfigService) => {
            return configService.get("STRIPE_API_KEY")
          },
          inject: [ConfigService]
        }
      ]
    }
  }
}