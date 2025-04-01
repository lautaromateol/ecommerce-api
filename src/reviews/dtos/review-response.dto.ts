import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty } from "class-validator";
import { SaveReviewDto } from "./save-review.dto";
import { UserResponseDto } from "../../users/dtos/user-response.dto";

export class ReviewResponseDto extends SaveReviewDto {
  @ApiProperty({ description: "ID of the review." })
  @IsUUID("4")
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: "User of the review", example: UserResponseDto })
  user: UserResponseDto
}