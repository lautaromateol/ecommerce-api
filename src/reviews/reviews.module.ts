import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "../products/products.module";
import { UsersModule } from "../users/users.module";
import { ReviewsController } from "./reviews.controller";
import { ReviewEntity } from "./review.entitity";
import { ReviewsService } from "./reviews.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity]),
    ProductsModule,
    UsersModule
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController]
})
export class ReviewsModule { }