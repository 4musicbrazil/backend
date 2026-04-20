import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CatalogService } from '../catalog/catalog.service';

@Injectable()
export class ListUappiService {
  constructor(private readonly catalogService: CatalogService) {}

  async findAll(): Promise<any> {
    try {
      return await this.catalogService.listProducts({
        provider: 'uappi',
        page: 1,
        perPage: 100,
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
}
