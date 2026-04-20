import { CatalogProviderType } from '../enums/catalog-provider.enum';

export interface CatalogProduct {
  provider: CatalogProviderType;
  externalId: string;
  name: string;
  description: string;
  sku: string;
  status: string;
  price: string;
  imageUrl: string;
  productUrl: string;
  adminUrl: string;
  raw?: any;
}

export interface CatalogListResult {
  provider: CatalogProviderType;
  page: number;
  perPage: number;
  items: CatalogProduct[];
}

