/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { EntityManager } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Test } from "@nestjs/testing"
import { ProductsService } from "../products/products.service"
import { ProductEntity } from "../products/product.entity"
import { OrdersService } from "./order.service"
import { OrderEntity } from "./order.entity"
import { UserEntity } from "../users/user.entity"
import { CategoryEntity } from "../categories/category.entity"
import { OrderDetailsEntity } from "../order-details/order-details.entity"
import { UsersService } from "../users/users.service"
import { CreateOrderDto } from "./dtos/create-order.dto"

type MockTransactionalEntityManager = {
  save: jest.Mock
}

describe("OrderService", () => {
  let ordersService: OrdersService
  let productsService: ProductsService
  let usersService: UsersService
  let transactionalEntityManager: MockTransactionalEntityManager

  const mockCategory: CategoryEntity = {
    id: "8909f77f-9f64-4449-abfe-73be1388ae49",
    name: "Test",
    products: []
  }

  const mockProduct: ProductEntity = {
    id: "8909f77f-9f64-4449-abfe-73be1388ae49",
    name: "Test",
    description: "Description",
    imgUrl: "http://test.com",
    price: 59.99,
    stock: 50,
    orderDetails: [],
    category: mockCategory,
    categoryId: mockCategory.id
  }

  const mockUser: UserEntity = {
    id: "8909f77f-9f64-4449-abfe-73be1388ae49",
    name: "Test",
    email: "test@email.com",
    password: "hashedPassword",
    isAdmin: false,
    orders: []
  }

  const mockOrder: CreateOrderDto = {
    userId: mockUser.id,
    products: [{ id: mockProduct.id }],
  }

  beforeEach(async () => {
    const mockProductsService: Partial<ProductsService> = {
      getProductsByIds: jest.fn().mockImplementation((products: { id: string }[]): Promise<ProductEntity[]> => {
        return Promise.resolve(products.map(() => mockProduct))
      }),
      getTotalPrice: jest.fn().mockImplementation((products: ProductEntity[]): number => {
        return products.reduce((acc, product) => acc + product.price, 0)
      })
    }

    const mockUsersService: Partial<UsersService> = {
      getUser: jest.fn().mockImplementation((id: string): Promise<UserEntity | null> => {
        return Promise.resolve(id === mockUser.id ? mockUser : null)
      })
    }

    transactionalEntityManager = {
      save: jest.fn().mockImplementation((entity, data) => {
        if (entity === OrderDetailsEntity) {
          return Promise.resolve({ id: "order-details-id", ...data })
        }
        if (entity === OrderEntity) {
          return Promise.resolve({ id: "order-id", ...data })
        }
        if (entity === ProductEntity) {
          return Promise.resolve(data)
        }
        return Promise.resolve(data)
      })
    }

    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            findOneBy: jest.fn(),
            findBy: jest.fn()
          }
        },
        {
          provide: ProductsService,
          useValue: mockProductsService
        },
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: EntityManager,
          useValue: {
            transaction: jest.fn().mockImplementation((callback) => callback(transactionalEntityManager))
          }
        }
      ]
    }).compile()

    ordersService = module.get<OrdersService>(OrdersService)
    productsService = module.get<ProductsService>(ProductsService)
    usersService = module.get<UsersService>(UsersService)
  })

  it("should be defined", () => {
    expect(ordersService).toBeDefined()
  })

  it("addOrder() should register an order in the database", async () => {
    const mockProducts = [mockProduct]

    const expectedOrder = {
      data: {
        price: mockProduct.price,
        orderDetailsId: "order-details-id"
      }
    }

    const result = await ordersService.addOrder(mockOrder)

    expect(result).toEqual(expectedOrder)

    expect(productsService.getProductsByIds).toHaveBeenCalledWith(mockOrder.products)
    expect(productsService.getTotalPrice).toHaveBeenCalledWith(mockProducts)
    expect(usersService.getUser).toHaveBeenCalledWith(mockOrder.userId)

    expect(transactionalEntityManager.save).toHaveBeenCalledWith(ProductEntity, mockProduct)

    expect(transactionalEntityManager.save).toHaveBeenCalledWith(OrderEntity, {
      user: mockUser
    })

    expect(transactionalEntityManager.save).toHaveBeenCalledWith(OrderDetailsEntity, {
      price: mockProduct.price,
      order: expect.any(Object),
      products: mockProducts
    })
  })
})