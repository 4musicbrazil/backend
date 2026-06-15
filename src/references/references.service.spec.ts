import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceInterfaceRepository } from './repository/reference.interface.repository';
import { ReferencesService } from './references.service';

describe('ReferencesService', () => {
  let service: ReferencesService;
  let repository: {
    listReference: jest.Mock;
    listReference1: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      listReference: jest.fn(),
      listReference1: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferencesService,
        {
          provide: ReferenceInterfaceRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<ReferencesService>(ReferencesService);
  });

  afterEach(() => {
    delete process.env.DEFAULT_CATALOG_PROVIDER;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('uses the configured default provider when none is provided', async () => {
    process.env.DEFAULT_CATALOG_PROVIDER = 'olist';
    repository.listReference.mockResolvedValue([]);

    await service.listReference('1044');

    expect(repository.listReference).toHaveBeenCalledWith('1044', 'olist');
  });

  it('keeps an explicitly provided provider', async () => {
    repository.listReference1.mockResolvedValue([]);

    await service.listReference1('1049', 'uappi');

    expect(repository.listReference1).toHaveBeenCalledWith('1049', 'uappi');
  });
});
