import { ApiProperty } from '@nestjs/swagger'
import { UserResponseDto } from './user-response.dto'

export class UpdateUserResponse {
  @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
  success: boolean

  @ApiProperty({ type: UserResponseDto, description: 'The updated user' })
  user: UserResponseDto
}