import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class OrderDataDto {
  @ApiProperty({
    example: 100.5,
    description: 'The price of the order'
  })
  price: number

  @ApiProperty({
    description: 'The ID of the order details'
  })
  @IsUUID("4")
  orderDetailsId: string
}

export class CreateOrderResponseDto {
  @ApiProperty({ type: OrderDataDto })
  data: OrderDataDto
}