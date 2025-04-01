import { Controller, HttpCode, NotFoundException, Param, Post, Get, ParseUUIDPipe, Put, Body, Delete, Query, ParseIntPipe } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { Auth } from "../decorators/auth.decorator"
import { Role } from "../auth/roles.enum"
import { ProductsService } from "./products.service"
import { SaveProductDto } from "./dtos/save-product.dto"
import { UpdateProductDto } from "./dtos/update-product-dto"

@ApiTags('products')
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all available products' })
  async getProducts(@Query("category") categoryId?: string, @Query("page", new ParseIntPipe({ optional: true })) page?: number, @Query("limit", new ParseIntPipe({ optional: true })) limit?: number) {
    const pageNumber = page || 1
    const limitNumber = limit || 20

    const products = await this.productsService.getProducts(pageNumber, limitNumber, categoryId === "all" ? "" : categoryId)

    return products
  }

  @Get("best-rated")
  @ApiOperation({ summary: "Get best rated products" })
  async getBestRated(@Query("page", new ParseIntPipe({ optional: true })) page?: number, @Query("limit", new ParseIntPipe({ optional: true })) limit?: number) {
    const pageNumber = page || 1
    const limitNumber = limit || 4

    const products = await this.productsService.getBestRated(pageNumber, limitNumber)

    return products
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async getProduct(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    const product = await this.productsService.getProduct(id)

    if (!product) {
      throw new NotFoundException("Product not found.")
    }

    return product
  }

  @Get("/slug/:slug")
  @ApiOperation({ summary: 'Get a product by slug' })
  @ApiParam({ name: 'slug', type: String, description: 'Slug of the product' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async getProductBySlug(@Param("slug") slug: string) {
    const product = await this.productsService.getProductBySlug(slug)

    if (!product) {
      throw new NotFoundException("Product not found.")
    }

    return product
  }

  @Post()
  @ApiBearerAuth()
  @Auth(Role.ADMIN)
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: SaveProductDto, description: 'Data for creating a product' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async saveProduct(@Body() product: SaveProductDto) {
    const dbProduct = await this.productsService.saveProduct(product)

    return dbProduct
  }

  @Put(":id")
  @ApiBearerAuth()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product to update' })
  @ApiBody({ type: UpdateProductDto, description: 'Data for updating the product' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async updateProduct(@Param("id", ParseUUIDPipe) id: string, @Body() product: UpdateProductDto) {
    const response = await this.productsService.updateProduct(product, id)

    return response
  }

  @Delete(":id")
  @ApiBearerAuth()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product to delete' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.', schema: { example: { success: true, deletedId: 'uuid' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async deleteProduct(@Param("id", ParseUUIDPipe) id: string) {
    const response = await this.productsService.deleteProduct(id)

    return response
  }

  @Post("seeder")
  @HttpCode(201)
  @ApiOperation({ summary: 'Load products from seeder' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async addProducts() {
    const response = await this.productsService.addProducts()

    return response
  }
}