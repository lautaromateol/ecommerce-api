/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import slugify from "slugify";
import { In, MoreThan, Repository } from "typeorm";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "./product.entity";
import { productsSeed } from "./products.seed";
import { CategoriesService } from "../categories/categories.service";
import { SaveProductDto } from "./dtos/save-product.dto";
import { ProductResponseDto } from "./dtos/product-response.dto";
import { UpdateProductResponse } from "./dtos/update-response.dto";
import { LoadProductsResponseDto } from "./dtos/load-products-response.dto";
import { UpdateProductDto } from "./dtos/update-product-dto";
import { PaginatedProductsResponseDto } from "./dtos/paginated-products-response.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    private readonly categoriesService: CategoriesService
  ) { }

  async getProducts(page: number, limit: number, categoryId?: string): Promise<PaginatedProductsResponseDto> {
    const skip = (page - 1) * limit;

    const products = categoryId ?
      await this.productsRepository.find({
        skip,
        take: limit,
        where: { categoryId, stock: MoreThan(0) },
        relations: ["category", "reviews"]
      }) :
      await this.productsRepository.find({
        skip,
        take: limit,
        where: { stock: MoreThan(0) },
        relations: ["category", "reviews"]
      })

    return {
      products,
      page,
      limit
    }
  }

  async getBestRated(page: number, limit: number): Promise<PaginatedProductsResponseDto> {
    const skip = (page - 1) * limit;
    
    const allProducts = await this.productsRepository.find({
      relations: ['reviews']
    });

    const productsWithRatings = allProducts.map(product => {
      const ratings = product.reviews.map(review => review.rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0;
      
      return {
        ...product,
        averageRating: parseFloat(averageRating.toFixed(2)) 
      };
    });

    const filteredProducts = productsWithRatings
      .filter(product => product.averageRating > 0)
      .sort((a, b) => b.averageRating - a.averageRating);

    const paginatedProducts = filteredProducts.slice(skip, skip + limit);

    return {
      page,
      limit,
      products: paginatedProducts
    };
}

  getProduct(id: string): Promise<ProductResponseDto | null> {
    return this.productsRepository.findOne({
      where: { id },
      relations: ["category", "reviews", "reviews.user"]
    })
  }

  getProductBySlug(slug: string): Promise<ProductResponseDto | null> {
    return this.productsRepository.findOne({
      where: { slug },
      relations: ["category", "reviews", "reviews.user"]
    })
  }

  async saveProduct(product: SaveProductDto): Promise<ProductResponseDto> {
    const dbCategory = await this.categoriesService.getCategory(product.categoryId)

    if (!dbCategory) {
      throw new BadRequestException("This category does not exist.")
    }

    return this.productsRepository.save(product)
  }

  async updateProduct(product: UpdateProductDto, id: string): Promise<UpdateProductResponse> {
    if (product.categoryId) {
      const dbCategory = await this.categoriesService.getCategory(product.categoryId)

      if (!dbCategory) {
        throw new BadRequestException("This category does not exist.")
      }
    }

    const dbProduct = await this.productsRepository.findOne({ where: { id } })

    if (!dbProduct) {
      throw new NotFoundException("Product not found.")
    }

    for (const prop in product) {
      if (Object.prototype.hasOwnProperty.call(product, prop) && prop !== "id" && product[prop] !== undefined) {
        dbProduct[prop] = product[prop]
      }
    }

    try {
      const newProduct = await this.productsRepository.save(dbProduct)
      return { success: true, product: newProduct }
    } catch {
      throw new InternalServerErrorException("There was an error updating the product. Try again later.")
    }
  }

  async deleteProduct(id: string) {
    const dbProduct = await this.productsRepository.findOne({ where: { id } })

    if (!dbProduct) {
      throw new NotFoundException("Product not found.")
    }

    try {
      await this.productsRepository.delete(dbProduct.id)
      return { success: true, deletedId: dbProduct.id }
    } catch {
      throw new InternalServerErrorException("There was an error deleting the product. Try again later.")
    }
  }

  async addProducts(): Promise<LoadProductsResponseDto> {
    try {
      const categoriesSet = new Set(productsSeed.map((product) => product.category))

      const seedCategories = [...categoriesSet].map((category) => ({
        name: category
      }))

      const categories = await this.categoriesService.addCategories([...seedCategories])

      const productsPromises = productsSeed.map((product) => {
        const dbProduct = new ProductEntity()
        dbProduct.name = product.name
        dbProduct.description = product.description
        dbProduct.price = Number(product.price)
        dbProduct.stock = product.stock
        dbProduct.slug = slugify(product.name)
        dbProduct.imgUrl = "https://res.cloudinary.com/dubuaqpfm/image/upload/v1741975033/iPhone_15_appvq0.webp"
        dbProduct.category = categories.find((category) => category.name === product.category)!
        return this.productsRepository.save(dbProduct)
      })

      const products = await Promise.all(productsPromises)

      return { products, success: true }
    } catch {
      throw new InternalServerErrorException("Error loading products.")
    }
  }

  getProductsByIds(products: { id: string }[]) {
    const ids = products.map((product) => product.id)

    return this.productsRepository.findBy({ id: In(ids) })
  }

  getTotalPrice(products: ProductEntity[]) {
    return products.reduce((acc, product) => acc + Number(product.price), 0)
  }
}