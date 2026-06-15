import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CatalogService } from './catalog.service';

@ApiTags('Catalog')
@ApiBearerAuth()
@Controller('catalog')
@UseGuards(JwtAuthGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  listProducts(
    @Query('provider') provider?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('search') search?: string,
  ) {
    return this.catalogService.listProducts({
      provider,
      page: page ? +page : 1,
      perPage: perPage ? +perPage : 100,
      search,
    });
  }

  @Get('products/:provider/:externalId')
  getProduct(
    @Param('provider') provider: string,
    @Param('externalId') externalId: string,
  ) {
    return this.catalogService.getProductById(provider, externalId);
  }
}
