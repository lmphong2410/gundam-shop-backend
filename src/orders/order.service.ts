import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { CartService } from '../cart/cart.service';

type CartItemPopulated = {
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
};

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
  ) {}

  async createOrder(userId: string) {
    const cartItems = await this.cartService.getUserCart(userId);
    if (!cartItems.length) throw new Error('Cart is empty');

    const products = cartItems.map((item) => ({
      productId: (item.productId as any)._id,
      quantity: item.quantity,
    }));

    const totalPrice = (cartItems as unknown as CartItemPopulated[]).reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0,
    );

    const order = new this.orderModel({
      userId,
      products,
      totalPrice,
      status: 'pending',
    });
    await order.save();

    await this.cartService.clearCart(userId);

    return order;
  }

  async getOrderHistory(userId: string) {
    return this.orderModel
      .find({ userId })
      .populate('products.productId')
      .exec();
  }
}
