import { EntityManager, Repository } from "typeorm";
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./order.entity";
import { ProductsService } from "../products/products.service";
import { UserEntity } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import { ProductEntity } from "../products/product.entity";
import { AddOrderDto } from "./dtos/add-order.dto";
import { AddOrderResponseDto } from "./dtos/add-order-response.dto";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly entityManager: EntityManager
  ) { }

  async addOrder(order: AddOrderDto): Promise<AddOrderResponseDto> {
    const products = (await this.productsService.getProductsByIds(order.cartItems)).filter((product) => product.stock > 0)

    if (products.length === 0) {
      throw new BadRequestException("These products are not available.")
    }

    const user = await this.usersService.getUser(order.userId)

    if (!user) throw new UnauthorizedException("Unauthorized.")

    try {
      return this.entityManager.transaction(async (transactionalEntityManager) => {
        await Promise.all(products.map((product) => {
          product.stock = product.stock - 1

          return transactionalEntityManager.save(ProductEntity, product)
        }))

        const savedOrder = await transactionalEntityManager.save(OrderEntity, {
          ...order,
          user
        });

        return { success: true, order: savedOrder }
      })
    } catch {
      throw new InternalServerErrorException("There was an error processing the order. Try again later.")
    }
  }

  getOrder(id: string) {
    return this.ordersRepository.findOneBy({ id })
  }

  getOrdersByUser(user: UserEntity) {
    return this.ordersRepository.findBy({ user })
  }
}