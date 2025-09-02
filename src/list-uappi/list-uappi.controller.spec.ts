import { Test, TestingModule } from '@nestjs/testing';
import { ListUappiController } from './list-uappi.controller';
import { ListUappiService } from './list-uappi.service';

describe('ListUappiController', () => {
  let controller: ListUappiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListUappiController],
      providers: [ListUappiService],
    }).compile();

    controller = module.get<ListUappiController>(ListUappiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
