import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './products/product.module';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/ecommerce'),
    ProductModule,
    UsersModule, // thêm dòng này
    AuthModule, // thêm dòng này
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // trỏ tới thư mục uploads
    }),
  ],
})
export class AppModule {}
