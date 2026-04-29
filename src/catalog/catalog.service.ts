import { BadRequestException, Injectable } from '@nestjs/common';

import {
  CatalogProviderType,
  getDefaultCatalogProvider,
} from './enums/catalog-provider.enum';
import { CatalogListResult, CatalogProduct } from './interfaces/catalog-product.interface';
import { CatalogProvider } from './interfaces/catalog-provider.interface';
import { OlistCatalogProvider } from './providers/olist-catalog.provider';
import { UappiCatalogProvider } from './providers/uappi-catalog.provider';

@Injectable()
export class CatalogService {
  private readonly providers: Record<CatalogProviderType, CatalogProvider>;

  constructor(
    private readonly uappiCatalogProvider: UappiCatalogProvider,
    private readonly olistCatalogProvider: OlistCatalogProvider,
  ) {
    this.providers = {
      [CatalogProviderType.UAPPI]: this.uappiCatalogProvider,
      [CatalogProviderType.OLIST]: this.olistCatalogProvider,
    };
  }

  normalizeProvider(provider?: string): CatalogProviderType {
    const normalized =
      (provider?.toLowerCase() as CatalogProviderType) ??
      getDefaultCatalogProvider();

    if (!this.providers[normalized]) {
      throw new BadRequestException(`Unsupported catalog provider: ${provider}`);
    }

    return normalized;
  }

  private getProvider(provider?: string): CatalogProvider {
    return this.providers[this.normalizeProvider(provider)];
  }

  async listProducts(params: {
    provider?: string;
    page?: number;
    perPage?: number;
    search?: string;
  }): Promise<CatalogListResult> {
    const provider = this.normalizeProvider(params.provider);
    const page = params.page && params.page > 0 ? params.page : 1;
    const perPage = params.perPage && params.perPage > 0 ? params.perPage : 100;
    const providerService = this.getProvider(provider);
    const items = params.search
      ? await providerService.searchProducts({
          page,
          perPage,
          search: params.search,
        })
      : await providerService.listProducts({
          page,
          perPage,
        });

    return {
      provider,
      page,
      perPage,
      items,
    };
  }

  async getProductById(
    provider: string | undefined,
    externalId: string,
  ): Promise<CatalogProduct> {
    return this.getProvider(provider).getProductById(externalId);
  }
}
