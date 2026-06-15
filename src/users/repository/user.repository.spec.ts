import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { FindOperator } from 'typeorm';

import { User } from '../entities/user.entity';
import USER_FIELDS from '../fields/select-filds-user';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;
  let typeormRepository: { findOne: jest.Mock };

  beforeEach(async () => {
    typeormRepository = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: typeormRepository,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  it('looks up login emails case-insensitively and includes the password', async () => {
    await repository.findOneByEmail('User@Example.com', true);

    const options = typeormRepository.findOne.mock.calls[0][0];
    expect(options.where.email).toBeInstanceOf(FindOperator);
    expect(options.select).toEqual([...USER_FIELDS, 'password']);
  });

  it('does not retain the password field in later public lookups', async () => {
    await repository.findOneByEmail('user@example.com', true);
    await repository.findOneByEmail('user@example.com', false);

    const options = typeormRepository.findOne.mock.calls[1][0];
    expect(options.select).toEqual(USER_FIELDS);
    expect(options.select).not.toContain('password');
  });
});
