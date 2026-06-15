import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { CatalogProviderType } from '../../catalog/enums/catalog-provider.enum';
import { Product } from '../../products/entities/product.entity';
import { Reference } from '../entities/reference.entity';
import { ReferenceRepository } from './reference.repository';

describe('ReferenceRepository', () => {
  let repository: ReferenceRepository;
  let queryBuilder: Record<string, jest.Mock>;

  beforeEach(async () => {
    queryBuilder = {
      select: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferenceRepository,
        {
          provide: getRepositoryToken(Reference),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
          },
        },
      ],
    }).compile();

    repository = module.get<ReferenceRepository>(ReferenceRepository);
  });

  it('joins the owner product from the audio reference', async () => {
    await repository.listReference('1044', CatalogProviderType.OLIST);

    expect(queryBuilder.leftJoin).toHaveBeenCalledWith(
      Product,
      'p1',
      'p1.uuid = r.productId',
    );
    expect(queryBuilder.addSelect).toHaveBeenCalledWith(
      expect.stringContaining("'provider', p.provider"),
      'produtos',
    );
  });
});
