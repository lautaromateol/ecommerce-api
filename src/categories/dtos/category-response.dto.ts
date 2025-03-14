import { ProductResponseDto } from "../../products/dtos/product-response.dto";
import { SaveCategoryResponseDto } from "./save-category-response.dto";

export class CategoryResponseDto extends SaveCategoryResponseDto {
  products: ProductResponseDto[]
}