import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from '../catalog/catalog.service';
import { ListUappiService } from './list-uappi.service';

describe('ListUappiService', () => {
  let service: ListUappiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListUappiService,
        {
          provide: CatalogService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ListUappiService>(ListUappiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
