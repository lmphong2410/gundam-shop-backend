import { IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  products: { productId: string; quantity: number }[];
}
