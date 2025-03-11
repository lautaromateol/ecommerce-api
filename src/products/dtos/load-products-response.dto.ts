import { ApiProperty } from '@nestjs/swagger'
import { ProductResponseDto } from './product-response.dto'

export class LoadProductsResponseDto {
  @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
  success: boolean

  @ApiProperty({ type: [ProductResponseDto], description: 'The loaded products from the seed' })
  products: ProductResponseDto[]
}