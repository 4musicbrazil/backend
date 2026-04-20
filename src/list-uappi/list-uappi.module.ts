import { Module } from '@nestjs/common';
import { ListUappiService } from './list-uappi.service';
import { ListUappiController } from './list-uappi.controller';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
  imports: [CatalogModule],
  controllers: [ListUappiController],
  providers: [ListUappiService],
})
export class ListUappiModule {}
