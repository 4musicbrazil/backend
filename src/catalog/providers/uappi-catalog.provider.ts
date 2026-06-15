import { Injectable } from '@nestjs/common';

import ApiService from '../../configs/api.service';
import { CatalogProviderType } from '../enums/catalog-provider.enum';
import {
  CatalogProvider,
  CatalogQuery,
} from '../interfaces/catalog-provider.interface';
import { CatalogProduct } from '../interfaces/catalog-product.interface';

@Injectable()
export class UappiCatalogProvider implements CatalogProvider {
  readonly type = CatalogProviderType.UAPPI;

  private readonly authBaseUrl =
    process.env.URL_UAPPI_API ?? 'https://www.4music.com.br/api';
  private readonly publicBaseUrl =
    process.env.UAPPI_PUBLIC_API_URL ?? this.authBaseUrl;
  private readonly secretKey = process.env.SECRET_KEY;
  private readonly apiKey = process.env.API_KEY;
  private readonly appToken = process.env.APP_TOKEN ?? 'wapstore';
  private readonly adminBaseUrl =
    process.env.UAPPI_ADMIN_BASE_URL ??
    'https://www.4music.com.br/wapstore/produto/gerenciamento/editar';

  private buildClient(baseURL: string) {
    return new ApiService(baseURL);
  }

  private buildHeaders(token: string) {
    return {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'App-Token': this.appToken,
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private async getToken(): Promise<string> {
    const client = this.buildClient(this.authBaseUrl);
    const response: any = await client.post(
      '/v2/auth',
      {
        apiKey: this.apiKey,
        secretKey: this.secretKey,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          'App-Token': this.appToken,
        },
      },
    );

    return response?.token ?? '';
  }

  private mapProduct(product: any): CatalogProduct {
    const externalId = String(product?.id ?? product?.produtoId ?? '');
    const imageUrl =
      product?.midias?.imagens?.[0]?.arquivosOriginais?.big ??
      product?.midias?.imagens?.[0]?.url ??
      product?.image_url ??
      '';
    const price =
      product?.precos?.por ??
      product?.precos?.precoPor ??
      product?.price ??
      '';
    const status =
      product?.ativo === false || product?.status === 'INACTIVE'
        ? 'INACTIVE'
        : 'ACTIVE';

    return {
      provider: this.type,
      externalId,
      name: product?.nome ?? product?.name ?? '',
      description:
        product?.descricao ?? product?.description ?? product?.descricoes?.curta ?? '',
      sku: product?.sku ?? '',
      status,
      price: String(price ?? ''),
      imageUrl,
      productUrl: product?.url ?? '',
      adminUrl: this.buildAdminUrl(externalId),
      raw: product,
    };
  }

  private extractItems(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.produtos)) {
      return response.produtos;
    }

    if (Array.isArray(response?.conteudo?.produtos)) {
      return response.conteudo.produtos;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    return [];
  }

  async listProducts(query: CatalogQuery): Promise<CatalogProduct[]> {
    const token = await this.getToken();
    const client = this.buildClient(this.publicBaseUrl);
    const offset = Math.max(query.page - 1, 0) * query.perPage;
    const response: any = await client.get(
      `/v2/products?offset=${offset}&limit=${query.perPage}`,
      this.buildHeaders(token),
    );

    return this.extractItems(response).map((item) => this.mapProduct(item));
  }

  async searchProducts(query: CatalogQuery): Promise<CatalogProduct[]> {
    const token = await this.getToken();
    const client = this.buildClient(this.publicBaseUrl);
    const offset = Math.max(query.page - 1, 0) * query.perPage;
    const search = encodeURIComponent(query.search ?? '');
    const response: any = await client.get(
      `/v2/front/url/product/listing/search?busca=${search}&offset=${offset}&limit=${query.perPage}`,
      this.buildHeaders(token),
    );

    return this.extractItems(response).map((item) => this.mapProduct(item));
  }

  async getProductById(externalId: string): Promise<CatalogProduct> {
    const token = await this.getToken();
    const client = this.buildClient(this.authBaseUrl);
    const response: any = await client.get(
      `/v2/products/${externalId}`,
      this.buildHeaders(token),
    );

    return this.mapProduct(response);
  }

  buildAdminUrl(externalId: string): string {
    return `${this.adminBaseUrl}/${externalId}`;
  }
}
