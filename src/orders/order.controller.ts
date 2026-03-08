import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  createOrder(@Request() req) {
    return this.orderService.createOrder(req.user.userId);
  }

  @Get()
  getOrders(@Request() req) {
    return this.orderService.getOrderHistory(req.user.userId);
  }
}
