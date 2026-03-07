import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  stock: number;

  @Prop()
  image: string;
}

// Đây là dòng bạn cần thêm
export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);
