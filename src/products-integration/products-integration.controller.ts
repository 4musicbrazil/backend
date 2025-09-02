import {
  Controller,
  Get,
  Headers,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsIntegrationService } from './products-integration.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@ApiTags('Uappi')
@ApiBearerAuth()
@Controller('uappi/product')
export class ProductsIntegrationController {
  constructor(
    private readonly productsIntegrationService: ProductsIntegrationService,
  ) {}

  @Get('uappi/product/:idSkuProduto')
  findOneByIdSkuProduto(
    @Headers('Uappi-Token') uappiToken: string,
    @Param('idSkuProduto') idSkuProduto: string,
  ) {
    return this.productsIntegrationService.findOneByIdSkuProduto(
      uappiToken,
      idSkuProduto,
    );
  }
}
