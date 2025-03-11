import { Repository } from "typeorm"
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./category.entity";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { CategoryResponseDto } from "./dtos/category-response.dto";
import { UpdateCategoryResponse } from "./dtos/update-category-response.dto";
import { CategoryByIdResponse } from "./dtos/category-by-id-response.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>
  ) { }

  addCategories(categories: { name: string }[]) {
    return this.categoriesRepository.save(categories)
  }

  getCategory(id: string): Promise<CategoryByIdResponse | null> {
    return this.categoriesRepository.findOne({ where: { id }, relations: ["products"] })
  }

  getCategories(): Promise<CategoryResponseDto[]> {
    return this.categoriesRepository.find({
      select: ["id", "name"]
    })
  }

  saveCategory(category: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesRepository.save(category)
  }

  async updateCategory(category: Partial<CategoryEntity>): Promise<UpdateCategoryResponse> {
    const dbCategory = await this.categoriesRepository.findOne({ where: { id: category.id } })

    if (!dbCategory) {
      throw new NotFoundException("Category not found.")
    }

    if (!category.name) {
      throw new BadRequestException()
    }

    dbCategory.name = category.name

    try {
      const newCategory = await this.categoriesRepository.save(dbCategory)
      return { success: true, category: newCategory }
    } catch {
      throw new InternalServerErrorException("There was an error updating the category. Try again later.")
    }

  }

  async deleteCategory(id: string) {
    const dbCategory = await this.categoriesRepository.findOne({ where: { id } })

    if (!dbCategory) {
      throw new NotFoundException("Category not found.")
    }

    try {
      await this.categoriesRepository.delete(dbCategory.id)
      return { success: true, deletedId: dbCategory.id }
    } catch {
      throw new InternalServerErrorException("There was an error deleting the category. Try again later.")
    }
  }
}