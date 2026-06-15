import {
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
} from '@nestjs/common';

import { OlistCatalogProvider } from './olist-catalog.provider';

describe('OlistCatalogProvider', () => {
  const originalEnvironment = process.env;

  afterEach(() => {
    process.env = originalEnvironment;
  });

  it('rejects mixed production and sandbox configuration', async () => {
    process.env = {
      ...originalEnvironment,
      OLIST_API_URL: 'https://api.vnda.com.br',
      OLIST_API_TOKEN: 'token',
      OLIST_SHOP_HOST: 'fourmusic.vnda.dev',
    };
    const provider = new OlistCatalogProvider();

    await expect(
      provider.listProducts({ page: 1, perPage: 1 }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('rejects missing credentials before making a request', async () => {
    process.env = {
      ...originalEnvironment,
      OLIST_API_URL: 'https://api.vnda.com.br',
      OLIST_API_TOKEN: '',
      OLIST_SHOP_HOST: '',
    };
    const provider = new OlistCatalogProvider();

    await expect(
      provider.listProducts({ page: 1, perPage: 1 }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('does not expose the complete upstream product in the catalog response', () => {
    process.env = {
      ...originalEnvironment,
      OLIST_API_URL: 'https://api.vnda.com.br',
      OLIST_API_TOKEN: 'token',
      OLIST_SHOP_HOST: 'www.4music.com.br',
    };
    const provider = new OlistCatalogProvider();
    const product = (provider as any).mapProduct({
      id: 123,
      name: 'Product',
      variants: [{ id: 456 }],
    });

    expect(product).not.toHaveProperty('raw');
  });

  it('returns failed dependency for upstream errors', () => {
    const provider = new OlistCatalogProvider();
    let thrownError: HttpException;

    try {
      (provider as any).handleRequestError({
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(HttpException);
    expect(thrownError.getStatus()).toBe(HttpStatus.FAILED_DEPENDENCY);
  });

  it('removes accidental spaces and wrapping quotes from configuration', () => {
    process.env = {
      ...originalEnvironment,
      OLIST_API_URL: ' "https://api.vnda.com.br/api/v2" ',
      OLIST_API_TOKEN: ' "token" ',
      OLIST_SHOP_HOST: " 'www.4music.com.br' ",
    };
    const provider = new OlistCatalogProvider();
    const request = (provider as any).buildHeaders();

    expect((provider as any).baseUrl).toBe('https://api.vnda.com.br');
    expect(request.headers.Authorization).toBe('Bearer token');
    expect(request.headers['X-Shop-Host']).toBe('www.4music.com.br');
  });
});
