import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUUID, MaxLength, Min, IsOptional } from "class-validator";

export class UpdateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Smartphone X',
    required: false,
  })
  @IsString()
  @MaxLength(50)
  @IsOptional() // Campo opcional
  name?: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'A high-end smartphone with advanced features.',
    required: false,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional() // Campo opcional
  description?: string;

  @ApiProperty({
    description: 'The price of the product. Must be a decimal number with up to 2 decimal places.',
    example: 599.99,
    required: false,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional() // Campo opcional
  price?: number;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional() // Campo opcional
  stock?: number;

  @ApiProperty({
    description: 'The URL of the product image',
    example: 'https://example.com/images/smartphone-x.jpg',
    required: false,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional() // Campo opcional
  imgUrl?: string;

  @ApiProperty({ 
    description: "ID of the category to which the product belongs",
    required: false,
  })
  @IsUUID("4")
  @IsOptional() // Campo opcional
  categoryId?: string;
}