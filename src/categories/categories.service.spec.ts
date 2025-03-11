/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import {  NotFoundException } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { CategoriesService } from "./categories.service"
import { CategoryEntity } from "./category.entity"

describe("CategoriesService", () => {
  let categoriesService: CategoriesService
  let categoriesRepository: Repository<CategoryEntity>

  const mockCategory: CategoryEntity = {
    id: "8909f77f-9f64-4449-abfe-73be1388ae49",
    name: "Test",
    products: []
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
          }
        }
      ]
    }).compile()

    categoriesService = module.get<CategoriesService>(CategoriesService)
    categoriesRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity))
  })

  it("to be defined", () => {
    expect(categoriesService).toBeDefined()
  })

  it("addCategories() should add categories to the database.", async () => {
    const categories = [mockCategory]
    jest.spyOn(categoriesRepository, "save").mockResolvedValueOnce(categories as any)

    const result = await categoriesService.addCategories(categories)
    expect(result).toEqual(categories)
    expect(categoriesRepository.save).toHaveBeenCalledWith(categories)
  })

  it("getCategory() should return a category with the proportionated id.", async () => {
    jest.spyOn(categoriesRepository, "findOne").mockResolvedValueOnce(mockCategory)

    const result = await categoriesService.getCategory(mockCategory.id)
    expect(result).toEqual(mockCategory)
    expect(categoriesRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockCategory.id }, relations: ["products"]
    })
  })

  it("getCategories() should return all the categories in the database.", async () => {
    jest.spyOn(categoriesRepository, "find").mockResolvedValueOnce([mockCategory])

    const result = await categoriesService.getCategories()
    expect(result).toEqual([mockCategory])
    expect(categoriesRepository.find).toHaveBeenCalledWith()
  })

  it("saveCategory() should save a category in the database.", async () => {
    const categoryName = "Test"

    jest.spyOn(categoriesRepository, "save").mockResolvedValueOnce(mockCategory)

    const result = await categoriesService.saveCategory(categoryName)
    expect(result).toEqual(mockCategory)
    expect(categoriesRepository.save).toHaveBeenCalledWith({ name: categoryName })
  })

  it("updateCategory() should throw a NotFoundException if the ID does not exist in the database.", async () => {
    await expect(categoriesService.updateCategory({
      ...mockCategory,
      id: "Invalid ID"
    })).rejects.toThrow(NotFoundException)
  })

  it("updateCategory() should update a category in the database.", async () => {
    const newName = "New name"

    jest.spyOn(categoriesRepository, "findOne").mockResolvedValueOnce(mockCategory)
    jest.spyOn(categoriesRepository, "save").mockResolvedValueOnce({...mockCategory, name: newName})

    const { success, category } = await categoriesService.updateCategory({ id: mockCategory.id, name: newName })

    expect(success).toBeTruthy()
    expect(category).toEqual({
      ...mockCategory,
      name: newName
    })
    expect(categoriesRepository.findOne).toHaveBeenCalledWith({ where: { id: mockCategory.id } })
    expect(categoriesRepository.save).toHaveBeenCalledWith({ ...mockCategory, name: newName })
  })

  it("deleteCategory() should throw a NotFoundException if the ID does not exist in the database.", async () => {
    await expect(categoriesService.deleteCategory("Invalid ID")).rejects.toThrow(NotFoundException)
  })

  it("deleteCategory() should delete a category in the database.", async () => {
    jest.spyOn(categoriesRepository, "findOne").mockResolvedValueOnce(mockCategory)

    const { success, deletedId } = await categoriesService.deleteCategory(mockCategory.id)

    expect(success).toBeTruthy()
    expect(deletedId).toEqual(mockCategory.id)
    expect(categoriesRepository.findOne).toHaveBeenCalledWith({ where: { id: mockCategory.id } })
    expect(categoriesRepository.delete).toHaveBeenCalledWith(mockCategory.id)
  })
})