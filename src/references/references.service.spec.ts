import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceInterfaceRepository } from './repository/reference.interface.repository';
import { ReferencesService } from './references.service';

describe('ReferencesService', () => {
  let service: ReferencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferencesService,
        {
          provide: ReferenceInterfaceRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ReferencesService>(ReferencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
