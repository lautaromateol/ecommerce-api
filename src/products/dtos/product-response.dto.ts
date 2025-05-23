import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";
import { ReviewResponseDto } from "../../reviews/dtos/review-response.dto";

class CategoryDto {
  @ApiProperty({ description: "ID of the category to which the product belongs" })
  @IsUUID("4")
  id: string;

  @ApiProperty({ description: "Name of the category to which the product belongs", example: "Smartphones" })
  @IsString()
  name: string;
}

export class ProductResponseDto {
  @ApiProperty({ description: "Product ID" })
  @IsUUID("4")
  id: string;

  @ApiProperty({ description: "Product name", example: "Smartphone X" })
  name: string;

  @ApiProperty({
    description: "Product description", example: "A high-end smartphone with advanced features.",
  })
  description: string;

  @ApiProperty({
    description: "Product slug", example: "smartphone-x"
  })
  slug: string;

  @ApiProperty({ description: "Product price", example: 599.99 })
  price: number;

  @ApiProperty({ description: "Available stock", example: 100 })
  stock: number;

  @ApiProperty({ description: "Product image URL", example: "https://example.com/images/smartphone-x.jpg" })
  imgUrl: string;

  @ApiProperty({ description: "ID of the category to which the product belongs" })
  @IsUUID("4")
  categoryId: string;

  @ApiProperty({ description: "Product Category", example: CategoryDto })
  category: CategoryDto

  @ApiProperty({ description: "Product reviews", example: ReviewResponseDto })
  reviews: ReviewResponseDto[]
}