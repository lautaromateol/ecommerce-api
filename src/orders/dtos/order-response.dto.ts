import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AddOrderDto } from "./add-order.dto";

export class OrderResponseDto extends AddOrderDto {
  @ApiProperty({
    description: 'Order UUID',
  })
  @IsUUID("4")
  id: string;
}