import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsOptional()
  @IsString()
  image?: string; // thêm field này
}
