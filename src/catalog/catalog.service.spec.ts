import { Test, TestingModule } from '@nestjs/testing';

import { CatalogProviderType } from './enums/catalog-provider.enum';
import { CatalogService } from './catalog.service';
import { OlistCatalogProvider } from './providers/olist-catalog.provider';
import { UappiCatalogProvider } from './providers/uappi-catalog.provider';

describe('CatalogService', () => {
  let service: CatalogService;
  let olistCatalogProvider: {
    listProducts: jest.Mock;
    searchProducts: jest.Mock;
    getProductById: jest.Mock;
  };
  let uappiCatalogProvider: {
    listProducts: jest.Mock;
    searchProducts: jest.Mock;
    getProductById: jest.Mock;
  };

  beforeEach(async () => {
    delete process.env.DEFAULT_CATALOG_PROVIDER;

    olistCatalogProvider = {
      listProducts: jest.fn().mockResolvedValue([]),
      searchProducts: jest.fn().mockResolvedValue([]),
      getProductById: jest.fn(),
    };
    uappiCatalogProvider = {
      listProducts: jest.fn().mockResolvedValue([]),
      searchProducts: jest.fn().mockResolvedValue([]),
      getProductById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: UappiCatalogProvider,
          useValue: uappiCatalogProvider,
        },
        {
          provide: OlistCatalogProvider,
          useValue: olistCatalogProvider,
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
  });

  afterEach(() => {
    delete process.env.DEFAULT_CATALOG_PROVIDER;
  });

  it('uses Olist as the default catalog provider', async () => {
    await service.listProducts({ page: 1, perPage: 100 });

    expect(olistCatalogProvider.listProducts).toHaveBeenCalledWith({
      page: 1,
      perPage: 100,
    });
    expect(uappiCatalogProvider.listProducts).not.toHaveBeenCalled();
  });

  it('trims the search term before searching Olist products', async () => {
    await service.listProducts({
      page: 1,
      perPage: 100,
      search: '  violao azul  ',
    });

    expect(olistCatalogProvider.searchProducts).toHaveBeenCalledWith({
      page: 1,
      perPage: 100,
      search: 'violao azul',
    });
  });

  it('keeps Uappi when the provider is selected explicitly', async () => {
    await service.listProducts({
      provider: CatalogProviderType.UAPPI,
      page: 1,
      perPage: 100,
    });

    expect(uappiCatalogProvider.listProducts).toHaveBeenCalledWith({
      page: 1,
      perPage: 100,
    });
    expect(olistCatalogProvider.listProducts).not.toHaveBeenCalled();
  });
});
