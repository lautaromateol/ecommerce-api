import { ApiProperty } from "@nestjs/swagger";
import { NewUserResponseDto } from "../../users/dtos/new-user-response.dto";

export class SignUpResponseDto {
  @ApiProperty({ example: true, description: "Indicates if the operation was successful" })
  success: boolean;

  @ApiProperty({ type: NewUserResponseDto, description: "The created user" })
  user: NewUserResponseDto
}