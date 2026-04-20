import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { ProductsIntegrationService } from './products-integration.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Uappi')
@ApiBearerAuth()
@Controller('uappi/product')
export class ProductsIntegrationController {
  constructor(
    private readonly productsIntegrationService: ProductsIntegrationService,
  ) {}

  @Get('uappi/product/:idSkuProduto')
  findOneByIdSkuProduto(
    @Param('idSkuProduto') idSkuProduto: string,
  ) {
    return this.productsIntegrationService.findOneByIdSkuProduto(idSkuProduto);
  }
}
