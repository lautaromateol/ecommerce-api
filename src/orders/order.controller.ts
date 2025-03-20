import { Body, Controller, Get, HttpCode, NotFoundException, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrdersService } from "./order.service";
import { AddOrderDto } from "./dtos/add-order.dto";
import { AuthGuard } from "src/guards/auth.guard";

@ApiTags("orders")
@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) { }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Get a order by ID" })
  @ApiParam({ name: "id", type: String, description: "ID of the order" })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getOrder(@Param("id", new ParseUUIDPipe()) id: string) {
    const order = await this.ordersService.getOrder(id)

    if (!order) {
      throw new NotFoundException("Order not found.")
    }

    return order
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @ApiOperation({ summary: "Create a order" })
  @ApiBody({ type: AddOrderDto, description: "Data for creating a order" })
  @ApiResponse({ status: 400, description: "These products are not available." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "User not found." })
  @ApiResponse({ status: 500, description: "There was an error processing the order. Try again later." })
  async addOrder(@Body() orderDto: AddOrderDto) {
    const order = await this.ordersService.addOrder(orderDto)

    return order
  }
}