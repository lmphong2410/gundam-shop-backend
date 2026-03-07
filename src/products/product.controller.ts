import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // nơi lưu ảnh
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
    }),
  )
  async uploadProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create({
      ...createProductDto,
      image: file.filename,
    });
  }

  // CRUD cơ bản
  @Post() create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }
  @Get() findAll() {
    return this.productService.findAll();
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
