import { ProductResponseDto } from "../../products/dtos/product-response.dto";
import { CategoryResponseDto } from "./category-response.dto";

export class CategoryByIdResponse extends CategoryResponseDto {
  products: ProductResponseDto[]
}