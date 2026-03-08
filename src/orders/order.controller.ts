import { Controller, Post, Get, UseGuards, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorators/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  createOrder(@User('userId') userId: string) {
    return this.orderService.createOrder(userId);
  }

  @Get()
  getOrderHistory(@User('userId') userId: string) {
    return this.orderService.getOrderHistory(userId);
  }

  @Get(':id')
  getOrderById(@Param('id') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }
}
