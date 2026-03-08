import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { Product, ProductSchema } from '../products/product.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CartModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
