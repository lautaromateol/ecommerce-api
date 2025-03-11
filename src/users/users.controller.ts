import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, ParseUUIDPipe, Put, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { AuthGuard } from "../guards/auth.guard"
import { Auth } from "../decorators/auth.decorator"
import { Role } from "../auth/roles.enum"
import { UsersService } from "./users.service"
import { UpdateUserDto } from "./dtos/update-user-dto"

@ApiTags('users')
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @Get()
  @ApiBearerAuth()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Get a list of users' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of items per page' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getUsers(@Query("page", new ParseIntPipe({ optional: true })) page?: number, @Query("limit", new ParseIntPipe({ optional: true })) limit?: number) {
    const pageNumber = page || 1
    const limitNumber = limit || 5

    const paginatedUsers = await this.usersService.getUsers(pageNumber, limitNumber)

    return paginatedUsers
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUser(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    const user = await this.usersService.getUser(id)

    if (!user) {
      throw new NotFoundException("User not found.")
    }

    return user
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user to update' })
  @ApiBody({ type: UpdateUserDto, description: 'Data for updating the user' })
  @ApiResponse({ status: 400, description: "Bad Request." })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(@Param("id", new ParseUUIDPipe()) id: string, @Body() user: UpdateUserDto) {
    const response = await this.usersService.updateUser(user, id)

    return response
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the user to delete' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.', schema: { example: { success: true, deletedId: 'uuid' } } })
  @ApiResponse({ status: 400, description: "Bad Request." })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteUser(@Param("id", new ParseUUIDPipe()) id: string) {
    const response = await this.usersService.deleteUser(id)

    return response
  }
}