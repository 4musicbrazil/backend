import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';

describe('TokensService', () => {
  let tokenService: TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TokensService,
          useValue: {
            create: jest.fn(),
            getByToken: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenService = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });
});
