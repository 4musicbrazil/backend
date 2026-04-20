import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductInterfaceRepository } from './repository/product.interface.repository';
import { ProductRepository } from './repository/product.repository';
import { CatalogModule } from '../catalog/catalog.module';

import { StorageService } from '../lib/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CatalogModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    StorageService,
    ProductRepository,
    {
      provide: ProductInterfaceRepository,
      useExisting: ProductRepository,
    },
  ],
})
export class ProductsModule {}
