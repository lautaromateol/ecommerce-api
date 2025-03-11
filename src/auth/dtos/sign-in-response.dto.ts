import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class SignInResponseDto {
  @ApiProperty({ example: true, description: "Indicates if the operation was successful" })
  success: boolean;

  @ApiProperty({ type: "string", description: "The JWT Token of the user" })
  @IsJWT()
  token: string;
}