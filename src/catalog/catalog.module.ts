import { Module } from '@nestjs/common';

import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { OlistCatalogProvider } from './providers/olist-catalog.provider';
import { UappiCatalogProvider } from './providers/uappi-catalog.provider';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService, UappiCatalogProvider, OlistCatalogProvider],
  exports: [CatalogService],
})
export class CatalogModule {}

