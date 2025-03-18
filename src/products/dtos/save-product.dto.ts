import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength, Min } from "class-validator";

export class SaveProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Smartphone X',
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'A high-end smartphone with advanced features.',
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The price of the product. Must be a decimal number with up to 2 decimal places.',
    example: 599.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    description: 'The URL of the product image',
    example: 'https://example.com/images/smartphone-x.jpg',
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  imgUrl: string;

  @ApiProperty({ description: "ID of the category to which the product belongs" })
  @IsUUID("4")
  @IsNotEmpty()
  categoryId: string;
}