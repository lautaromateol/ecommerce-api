import { Module } from "@nestjs/common";
import { OrderDetailsService } from "./order-details.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderDetailsEntity } from "./order-details.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetailsEntity])],
  providers: [OrderDetailsService],
  exports: [OrderDetailsService]
})
export class OrderDetailsModule {}