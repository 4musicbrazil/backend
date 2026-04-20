import { Module } from '@nestjs/common';
import { ProductsIntegrationService } from './products-integration.service';
import { ProductsIntegrationController } from './products-integration.controller';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
  imports: [CatalogModule],
  controllers: [ProductsIntegrationController],
  providers: [ProductsIntegrationService],
})
export class ProductsIntegrationModule {}
