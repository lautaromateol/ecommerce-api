import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({
    description: "The category's name.",
    example: "Smartphones",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}