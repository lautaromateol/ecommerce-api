import { ApiProperty } from '@nestjs/swagger'
import { SaveCategoryResponseDto } from './save-category-response.dto'

export class UpdateCategoryResponse {
  @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
  success: boolean

  @ApiProperty({ type: SaveCategoryResponseDto, description: 'The updated product' })
  category: SaveCategoryResponseDto
}