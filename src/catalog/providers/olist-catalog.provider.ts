import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

import ApiService from '../../configs/api.service';
import { CatalogProviderType } from '../enums/catalog-provider.enum';
import {
  CatalogProvider,
  CatalogQuery,
} from '../interfaces/catalog-provider.interface';
import { CatalogProduct } from '../interfaces/catalog-product.interface';

@Injectable()
export class OlistCatalogProvider implements CatalogProvider {
  readonly type = CatalogProviderType.OLIST;
  private readonly requestTimeout = 15000;
  private readonly logger = new Logger(OlistCatalogProvider.name);

  private readonly baseUrl = this.normalizeBaseUrl(
    this.normalizeEnvironmentValue(process.env.OLIST_API_URL) ??
      'https://api.vnda.com.br',
  );
  private readonly token =
    this.normalizeEnvironmentValue(process.env.OLIST_API_TOKEN) ?? '';
  private readonly shopHost =
    this.normalizeEnvironmentValue(process.env.OLIST_SHOP_HOST) ?? '';
  private readonly adminBaseUrl =
    this.normalizeEnvironmentValue(process.env.OLIST_ADMIN_BASE_URL) ??
    'https://app.olist.com/products';

  private buildClient() {
    return new ApiService(this.baseUrl);
  }

  private normalizeBaseUrl(baseUrl: string) {
    return baseUrl.replace(/\/+$/, '').replace(/\/api\/v2$/, '');
  }

  private normalizeEnvironmentValue(value?: string) {
    const normalized = value?.trim();
    if (!normalized) {
      return undefined;
    }

    const hasWrappingQuotes =
      (normalized.startsWith('"') && normalized.endsWith('"')) ||
      (normalized.startsWith("'") && normalized.endsWith("'"));

    return hasWrappingQuotes ? normalized.slice(1, -1).trim() : normalized;
  }

  private handleRequestError(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }

    const status = error?.response?.status;
    const upstreamMessage =
      error?.response?.data?.error ??
      error?.response?.data?.message ??
      error?.message ??
      'Unable to reach Olist catalog';
    const code = error?.code;

    this.logger.error(
      `Olist request failed: status=${status ?? 'none'} code=${code ?? 'none'} host=${this.shopHost || 'missing'} api=${this.baseUrl}`,
    );

    throw new HttpException(
      {
        provider: this.type,
        upstreamStatus: status,
        code,
        message: upstreamMessage,
      },
      HttpStatus.FAILED_DEPENDENCY,
    );
  }

  private buildHeaders() {
    this.validateConfiguration();

    return {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.token}`,
        'X-Shop-Host': this.shopHost,
      },
      timeout: this.requestTimeout,
    };
  }

  private validateConfiguration() {
    const missingVariables = [
      !this.token ? 'OLIST_API_TOKEN' : null,
      !this.shopHost ? 'OLIST_SHOP_HOST' : null,
    ].filter(Boolean);

    if (missingVariables.length) {
      throw new ServiceUnavailableException({
        provider: this.type,
        message: `Missing Olist configuration: ${missingVariables.join(', ')}`,
      });
    }

    const isSandboxApi = this.baseUrl.includes('sandbox.vnda.com.br');
    const isDevelopmentShop = this.shopHost.endsWith('.vnda.dev');

    if (isSandboxApi !== isDevelopmentShop) {
      throw new ServiceUnavailableException({
        provider: this.type,
        message:
          'OLIST_API_URL and OLIST_SHOP_HOST must both target production or both target sandbox',
      });
    }
  }

  private mapProduct(product: any): CatalogProduct {
    const externalId = String(product?.id ?? '');
    const price = product?.sale_price ?? product?.price ?? '';
    const status =
      product?.active === false || product?.available === false
        ? 'INACTIVE'
        : 'ACTIVE';

    return {
      provider: this.type,
      externalId,
      name: product?.name ?? product?.title ?? '',
      description:
        product?.description ??
        product?.plain_description ??
        product?.html_description ??
        '',
      sku: product?.reference ?? product?.sku ?? '',
      status,
      price: String(price ?? ''),
      imageUrl:
        product?.image_url ??
        product?.images?.[0]?.url ??
        product?.images?.[0]?.src ??
        '',
      productUrl: product?.url ?? '',
      adminUrl: this.buildAdminUrl(externalId),
    };
  }

  private extractItems(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.products)) {
      return response.products;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    return [];
  }

  private filterLocally(items: CatalogProduct[], query: CatalogQuery) {
    const search = (query.search ?? '').trim().toLowerCase();
    if (!search) {
      return items;
    }

    return items.filter((item) =>
      [item.name, item.description, item.sku, item.externalId]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search)),
    );
  }

  async listProducts(query: CatalogQuery): Promise<CatalogProduct[]> {
    const client = this.buildClient();
    try {
      const response: any = await client.get(
        `/api/v2/products?page=${query.page}&per_page=${query.perPage}&include_inactive=true&include_images=false`,
        this.buildHeaders(),
      );

      const items = this.extractItems(response);
      return items.map((item) => this.mapProduct(item));
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  async searchProducts(query: CatalogQuery): Promise<CatalogProduct[]> {
    const client = this.buildClient();
    try {
      const search = encodeURIComponent(query.search ?? '');
      const response: any = await client.get(
        `/api/v2/products/search?term=${search}&page=${query.page}&per_page=${query.perPage}&include_inactive=true&include_images=false`,
        this.buildHeaders(),
      );
      const items = this.extractItems(response);
      return items.map((item) => this.mapProduct(item));
    } catch (error) {
      try {
        const items = await this.listProducts(query);
        return this.filterLocally(items, query);
      } catch {
        this.handleRequestError(error);
      }
    }
  }

  async getProductById(externalId: string): Promise<CatalogProduct> {
    const client = this.buildClient();
    try {
      const response: any = await client.get(
        `/api/v2/products/${externalId}`,
        this.buildHeaders(),
      );

      return this.mapProduct(response);
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  buildAdminUrl(externalId: string): string {
    return `${this.adminBaseUrl}/${externalId}`;
  }
}
