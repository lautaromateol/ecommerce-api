import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, IsNotEmpty, IsNumber, Min, Max, IsUUID } from "class-validator";

export class SaveReviewDto {
  @ApiProperty({
    description: 'The title of the review',
    example: 'I love the product!',
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the review',
    example: 'The product was better of I was expecting!',
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The rating of the review.',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: "ID of the product wich the user is qualifying." })
  @IsUUID("4")
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: "ID of the user wich is qualifying." })
  @IsUUID("4")
  @IsNotEmpty()
  userId: string;
}