import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  addToCart(@Request() req, @Body() dto: AddCartDto) {
    return this.cartService.addToCart(req.user.userId, dto);
  }

  @Get()
  getCart(@Request() req) {
    return this.cartService.getUserCart(req.user.userId);
  }

  @Put(':productId')
  updateQuantity(
    @Request() req,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateQuantity(req.user.userId, productId, dto);
  }

  @Delete(':productId')
  removeProduct(@Request() req, @Param('productId') productId: string) {
    return this.cartService.removeProduct(req.user.userId, productId);
  }
}
