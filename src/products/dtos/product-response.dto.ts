import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class ProductResponseDto {
  @ApiProperty({ description: "Product ID"})
  @IsUUID("4")
  id: string;

  @ApiProperty({ description: "Product name", example: "Smartphone X" })
  name: string;

  @ApiProperty({
    description: "Product description", example: "A high-end smartphone with advanced features.",
  })
  description: string;

  @ApiProperty({ description: "Product price", example: 599.99 })
  price: number;

  @ApiProperty({ description: "Available stock", example: 100 })
  stock: number;

  @ApiProperty({ description: "Product image URL", example: "https://example.com/images/smartphone-x.jpg" })
  imgUrl: string;

  @ApiProperty({ description: "ID of the category to which the product belongs" })
  @IsUUID("4")
  categoryId: string;
}