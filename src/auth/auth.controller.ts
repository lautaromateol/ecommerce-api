import { Body, Controller, HttpCode, Post } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { CreateUserDto } from "./dtos/create-user.dto"
import { LoginUserDto } from "./dtos/sign-in-user.dto"

@ApiTags('auth')
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post("sign-up")
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto, description: 'Data for creating a new user' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async signUp(@Body() user: CreateUserDto) {
    const response = await this.authService.signUp(user)

    return response
  }

  @Post("sign-in")
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiBody({ type: LoginUserDto, description: 'User credentials for authentication' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async signIn(@Body() user: LoginUserDto) {
    const payload = await this.authService.signIn(user)
    
    return payload
  }
}