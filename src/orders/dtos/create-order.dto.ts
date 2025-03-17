import { IsUUID, IsString, IsBoolean, IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CartItemDTO {
  @ApiProperty({ description: 'ID of the cart item', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Title of the product in the cart', example: 'Product A' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Slug of the product in the cart', example: 'product-a' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Price of the product in the cart', example: 29.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Image URL of the product in the cart', example: 'https://example.com/product-a.jpg' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ description: 'Quantity of the product in the cart', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Charge ID from the payment gateway', example: 'ch_1A2b3C4d5E6f7G8h9I0j' })
  @IsString()
  @IsNotEmpty()
  chargeId: string;

  @ApiProperty({ description: 'Payment intent ID from the payment gateway', example: 'pi_1A2b3C4d5E6f7G8h9I0j' })
  @IsString()
  @IsNotEmpty()
  payment_intent: string;

  @ApiProperty({ description: 'Receipt URL from the payment gateway', example: 'https://example.com/receipt' })
  @IsString()
  @IsNotEmpty()
  receipt_url: string;

  @ApiProperty({ description: 'Whether the order has been refunded', example: false })
  @IsBoolean()
  @IsNotEmpty()
  refunded: boolean;

  @ApiProperty({ description: 'Status of the order', example: 'succeeded' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: 'Amount captured in the order', example: 100.0 })
  @IsNumber()
  @IsNotEmpty()
  amount_captured: number;

  @ApiProperty({ description: 'Currency of the order', example: 'usd' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'UUID of the user who placed the order', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'List of cart items in the order', type: [CartItemDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDTO)
  @IsNotEmpty()
  cartItems: CartItemDTO[];
}