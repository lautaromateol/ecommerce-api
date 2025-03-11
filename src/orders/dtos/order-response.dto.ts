import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class OrderResponseDto {
  @ApiProperty({
    description: 'Order UUID',
  })
  @IsUUID("4")
  id: string;

  @ApiProperty({
    description: 'Date when the order was created',
    example: '2023-10-01',
  })
  date: Date;

  @ApiProperty({
    description: 'UUID of the user who placed the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'UUID of the order details entity',
  })
  @IsUUID("4")
  orderDetailsId: string
}