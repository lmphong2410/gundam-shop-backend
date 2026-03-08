import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { Product } from '../products/product.schema';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<any>,
  ) {}

  async addToCart(userId: string, addCartDto: AddCartDto) {
    const { productId, quantity } = addCartDto;

    // Validate product tồn tại
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product với ID "${productId}" không tồn tại`);
    }

    // Validate stock
    if (product.stock < quantity) {
      throw new BadRequestException(`Số lượng sản phẩm không đủ. Còn lại: ${product.stock}`);
    }

    // Atomic upsert: tìm và update hoặc insert
    const cart = await this.cartModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId), productId: new Types.ObjectId(productId) },
      { $inc: { quantity } }, // Tăng quantity nếu tồn tại
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return cart.populate('productId', 'name price image');
  }

  async getUserCart(userId: string) {
    const items = await this.cartModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('productId', 'name price image')
      .lean()
      .exec();

    // Tính tổng tiền
    const total = items.reduce((sum, item) => {
      const product = item.productId as any;
      const price = product?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    return { items, total };
  }

  async updateQuantity(userId: string, productId: string, updateDto: UpdateCartDto) {
    const { quantity } = updateDto;

    // Validate product
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product với ID "${productId}" không tồn tại`);
    }

    if (product.stock < quantity) {
      throw new BadRequestException(`Số lượng sản phẩm không đủ. Còn lại: ${product.stock}`);
    }

    const cart = await this.cartModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId), productId: new Types.ObjectId(productId) },
      { quantity },
      { new: true },
    );

    if (!cart) {
      throw new NotFoundException(`Sản phẩm không có trong giỏ hàng`);
    }

    return cart.populate('productId', 'name price image');
  }

  async removeProduct(userId: string, productId: string) {
    const cart = await this.cartModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
    });

    if (!cart) {
      throw new NotFoundException(`Sản phẩm không có trong giỏ hàng`);
    }

    return { message: 'Đã xóa sản phẩm khỏi giỏ hàng' };
  }

  async clearCart(userId: string) {
    await this.cartModel.deleteMany({ userId: new Types.ObjectId(userId) });
    return { message: 'Đã xóa toàn bộ giỏ hàng' };
  }
}
