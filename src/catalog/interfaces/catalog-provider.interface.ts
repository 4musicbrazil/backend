import { CatalogProviderType } from '../enums/catalog-provider.enum';
import { CatalogProduct } from './catalog-product.interface';

export interface CatalogQuery {
  page: number;
  perPage: number;
  search?: string;
}
export interface CatalogProvider {
  readonly type: CatalogProviderType;
  listProducts(query: CatalogQuery): Promise<CatalogProduct[]>;
  searchProducts(query: CatalogQuery): Promise<CatalogProduct[]>;
  getProductById(externalId: string): Promise<CatalogProduct>;
  buildAdminUrl(externalId: string): string;
}
