import { Test, TestingModule } from '@nestjs/testing';
import { ListUappiService } from './list-uappi.service';

describe('ListUappiService', () => {
  let service: ListUappiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListUappiService],
    }).compile();

    service = module.get<ListUappiService>(ListUappiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
