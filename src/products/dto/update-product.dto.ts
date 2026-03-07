// src/products/dto/update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// UpdateProductDto kế thừa từ CreateProductDto nhưng tất cả field đều optional
export class UpdateProductDto extends PartialType(CreateProductDto) {}
