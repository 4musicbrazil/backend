import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductInterfaceRepository } from './repository/product.interface.repository';
import { ProductRepository } from './repository/product.repository';
import { IntegrationsModule } from 'src/integrations/integrations.module';
import { CloudinaryModule } from 'src/lib/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    IntegrationsModule,
    CloudinaryModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    {
      provide: ProductInterfaceRepository,
      useExisting: ProductRepository,
    },
  ],
})
export class ProductsModule {}
