import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async addToCart(userId: string, addCartDto: AddCartDto) {
    const existing = await this.cartModel.findOne({
      userId,
      productId: addCartDto.productId,
    });
    if (existing) {
      existing.quantity += addCartDto.quantity;
      return existing.save();
    }
    const cartItem = new this.cartModel({
      userId,
      productId: addCartDto.productId,
      quantity: addCartDto.quantity,
    });
    return cartItem.save();
  }

  async getUserCart(userId: string) {
    return this.cartModel
      .find({ userId })
      .populate('productId', 'name price')
      .lean()
      .exec();
  }

  async updateQuantity(
    userId: string,
    productId: string,
    updateDto: UpdateCartDto,
  ) {
    return this.cartModel.findOneAndUpdate(
      { userId, productId },
      { quantity: updateDto.quantity },
      { new: true },
    );
  }

  async removeProduct(userId: string, productId: string) {
    return this.cartModel.findOneAndDelete({ userId, productId });
  }

  async clearCart(userId: string) {
    return this.cartModel.deleteMany({ userId });
  }
}
