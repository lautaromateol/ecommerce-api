import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsUUID, ValidateNested } from "class-validator";
import { OrderEntity } from "../orders/order.entity";

export class Products {
  @ApiProperty({
    description: 'The UUID of the product',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID("4")
  id: string;
}

export class CreateOrderDetailsDto {
  @ApiProperty({
    description: 'The price of the order details',
    example: 99.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'An array of products included in the order',
    type: [Products],
    example: [{ id: '550e8400-e29b-41d4-a716-446655440000' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Products)
  products: Products[];

  @ApiProperty({
    description: 'The associated order entity',
    type: OrderEntity,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:00:00Z',
    },
  })
  order: OrderEntity;
}