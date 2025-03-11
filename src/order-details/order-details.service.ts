import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetailsEntity } from "./order-details.entity";
import { Repository } from "typeorm";
import { CreateOrderDetailsDto } from "./create-order-detail.dto";

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetailsEntity)
    private orderDetailsRepository: Repository<OrderDetailsEntity>
  ) { }

  async saveOrderDetail(order: CreateOrderDetailsDto) {
    try {
      const orderDetails = await this.orderDetailsRepository.save(order)
      return orderDetails
      
    } catch(error) {
      console.error(error)
      throw new InternalServerErrorException("There was an error creating the order details. Try again later.")
    }

  }

  getOrderDetails(id: string) {
    const orderDetails = this.orderDetailsRepository.findOneBy({ id })

    return orderDetails
  }
}