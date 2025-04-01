import { Body, Controller, HttpCode, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "../guards/auth.guard";
import { Role } from "../auth/roles.enum";
import { ReviewsService } from "./reviews.service";
import { SaveReviewDto } from "./dtos/save-review.dto";

interface JwtPayload {
  sub: string;
  id: string;
  email: string;
  name: string;
  roles: Role[];
  iat: number;
  exp: number;
}

interface CustomRequest extends Request {
  user?: JwtPayload
}

@Controller("reviews")
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService
  ) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiBody({ type: SaveReviewDto, description: 'Data for creating a review' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async saveReview(@Body() review: SaveReviewDto, @Req() request: CustomRequest) {
    if(request.user?.id !== review.userId) {
      throw new UnauthorizedException("Unauthorized.")
    }

    const dbReview = await this.reviewsService.saveService(review)

    return dbReview
  }
}