import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsSchema } from './schemas/products.schema';
import { ProductsService } from './products.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Products', schema: ProductsSchema }
        ]),
    ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
