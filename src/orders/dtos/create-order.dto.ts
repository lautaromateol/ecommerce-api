import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Products {
  @IsNotEmpty()
  @IsUUID("4") 
  id: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: "The UUID of the user who is making the order."
  })
  @IsNotEmpty()
  @IsUUID("4")
  userId: string;

  @ApiProperty({
    description: "An array of the products ID's of the current order."
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Products)
  products: Products[]
}
