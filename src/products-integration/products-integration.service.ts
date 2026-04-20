import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CatalogService } from '../catalog/catalog.service';

@Injectable()
export class ProductsIntegrationService {
  constructor(private readonly catalogService: CatalogService) {}

  async findOneByIdSkuProduto(idSkuProduto: string): Promise<any> {
    try {
      return await this.catalogService.getProductById('uappi', idSkuProduto);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
}
