import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from '../catalog/catalog.service';
import { StorageService } from '../lib/storage.service';
import { ProductInterfaceRepository } from './repository/product.interface.repository';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductInterfaceRepository,
          useValue: {},
        },
        {
          provide: StorageService,
          useValue: {},
        },
        {
          provide: CatalogService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
