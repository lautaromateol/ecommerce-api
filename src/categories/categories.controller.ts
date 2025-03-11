import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { Auth } from "../decorators/auth.decorator";
import { Role } from "../auth/roles.enum";
import { CreateCategoryDto } from "./dtos/create-category.dto";

@ApiTags('categories')
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async getCategories() {
    const categories = await this.categoriesService.getCategories();

    return categories;
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async getCategory(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    const category = await this.categoriesService.getCategory(id);

    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return category;
  }

  @Post()
  @ApiBearerAuth()
  @Auth(Role.ADMIN)
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto, description: 'Data for creating a category', schema: { properties: { name: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async saveCategory(@Body() category: CreateCategoryDto) {
    const dbCategory = await this.categoriesService.saveCategory(category);

    return dbCategory;
  }

  @Put(":id")
  @ApiBearerAuth()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Update an existing category' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category to update' })
  @ApiBody({ type: CreateCategoryDto, description: 'Data for updating the category', schema: { properties: { name: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async updateCategory(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
    @Body() category: CreateCategoryDto
  ) {
    const response = await this.categoriesService.updateCategory({ ...category, id });

    return response;
  }

  @Delete(":id")
  @ApiBearerAuth()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category to delete' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully.', schema: { example: { success: true, deletedId: 'uuid' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async deleteCategory(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string
  ) {
    const response = await this.categoriesService.deleteCategory(id);

    return response;
  }
}