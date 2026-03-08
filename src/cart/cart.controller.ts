import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorators/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  addToCart(@User('userId') userId: string, @Body() dto: AddCartDto) {
    return this.cartService.addToCart(userId, dto);
  }

  @Get()
  getCart(@User('userId') userId: string) {
    return this.cartService.getUserCart(userId);
  }

  @Put(':productId')
  updateQuantity(
    @User('userId') userId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateQuantity(userId, productId, dto);
  }

  @Delete(':productId')
  removeProduct(
    @User('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeProduct(userId, productId);
  }

  @Delete()
  clearCart(@User('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
