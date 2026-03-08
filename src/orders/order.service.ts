import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product.schema';

type CartItemPopulated = {
  productId: {
    _id: string;
    name: string;
    price: number;
    stock: number;
  };
  quantity: number;
};

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<any>,
    private cartService: CartService,
  ) {}

  async createOrder(userId: string) {
    // 1. Lấy giỏ hàng
    const cartData = await this.cartService.getUserCart(userId);

    // 2. Kiểm tra giỏ rỗng
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.');
    }

    const cartItems = cartData.items as unknown as CartItemPopulated[];

    // 3. Validate sản phẩm còn hàng
    for (const item of cartItems) {
      const product = await this.productModel.findById(item.productId._id);

      if (!product) {
        throw new NotFoundException(`Sản phẩm "${item.productId.name}" không tồn tại trong hệ thống.`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm "${product.name}" không đủ số lượng. Còn lại: ${product.stock}, bạn đặt: ${item.quantity}`
        );
      }
    }

    // 4. Chuẩn bị dữ liệu order
    const products = cartItems.map((item) => ({
      productId: new Types.ObjectId(item.productId._id),
      quantity: item.quantity,
    }));

    const totalPrice = cartData.total;

    // 5. Tạo order
    const order = new this.orderModel({
      userId: new Types.ObjectId(userId),
      products,
      totalPrice,
      status: 'pending',
    });

    await order.save();

    // 6. Trừ stock sản phẩm
    for (const item of cartItems) {
      await this.productModel.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // 7. Xóa giỏ hàng
    await this.cartService.clearCart(userId);

    // 8. Populate thông tin product cho response
    return order.populate('products.productId', 'name price image');
  }

  async getOrderHistory(userId: string) {
    return this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('products.productId', 'name price image')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getOrderById(orderId: string) {
    const order = await this.orderModel
      .findById(orderId)
      .populate('products.productId', 'name price image')
      .exec();

    if (!order) {
      throw new NotFoundException(`Đơn hàng với ID "${orderId}" không tồn tại.`);
    }

    return order;
  }
}
