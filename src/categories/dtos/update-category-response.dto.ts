import { ApiProperty } from '@nestjs/swagger'
import { CategoryResponseDto } from './category-response.dto'

export class UpdateCategoryResponse {
  @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
  success: boolean

  @ApiProperty({ type: CategoryResponseDto, description: 'The updated product' })
  category: CategoryResponseDto
}