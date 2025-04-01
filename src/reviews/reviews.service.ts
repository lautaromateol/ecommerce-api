import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductsService } from "../products/products.service";
import { UsersService } from "../users/users.service";
import { SaveReviewDto } from "./dtos/save-review.dto";
import { ReviewEntity } from "./review.entitity";
import { ReviewResponseDto } from "./dtos/review-response.dto";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewsRepository: Repository<ReviewEntity>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService
  ) {}

  async saveService(review: SaveReviewDto): Promise<ReviewResponseDto> {
    const product = await this.productsService.getProduct(review.productId)

    if(!product) {
      throw new BadRequestException("This product does not exist.")
    }

    const user = await this.usersService.getUser(review.userId)

    if(!user) {
      throw new BadRequestException("This user does not exist.")
    }

    if(user.orders.filter((order) => order.cartItems.some((item) => item.id === product.id)).length === 0) {
      throw new BadRequestException("You have to buy this product to write a review.")
    }

    const dbReview = await this.reviewsRepository.save(review)

    return dbReview
  }
}