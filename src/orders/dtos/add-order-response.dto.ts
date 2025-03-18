import { ApiProperty } from "@nestjs/swagger";
import { OrderResponseDto } from "./order-response.dto";

export class AddOrderResponseDto {
  @ApiProperty({ example: true, description: "Indicates if the operation was successful" })
  success: boolean;

  order: OrderResponseDto
}