import { Module } from "@nestjs/common"
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./product.entity";
import { CategoriesModule } from "src/categories/categories.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    CategoriesModule
  ],
  exports: [ProductsService],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}