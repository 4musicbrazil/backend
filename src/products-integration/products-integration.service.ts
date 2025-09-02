import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IntegrationService } from '../integrations/stores/integration.service';

@Injectable()
export class ProductsIntegrationService {
  constructor(private readonly integrationService: IntegrationService) {}

  async findOneByIdSkuProduto(
    uappiToken: string,
    idSkuProduto: string,
  ): Promise<any> {
    try {
      return this.integrationService.findOneByIdSkuProduto(
        uappiToken,
        idSkuProduto,
      );
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
}
