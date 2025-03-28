import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class SaveCategoryResponseDto {
  @ApiProperty({
    description: "Category ID"
  })
  @IsUUID("4")
  id: string;

  @ApiProperty({
    description: "Category name.",
    example: "Smartphones",
  })
  name: string;
}