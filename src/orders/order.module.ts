import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersController } from "./order.controller";
import { OrdersService } from "./order.service";
import { OrderEntity } from "./order.entity";
import { StripeModule } from "../stripe/stripe.module";
import { ProductsModule } from "../products/products.module";
import { UsersModule } from "../users/users.module";


@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    StripeModule.forRootAsync(),
    ProductsModule,
    UsersModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrderModule {}