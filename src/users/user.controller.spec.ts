import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const userData = {
  email: 'jhoeDue@example.com',
  password: 'password',
  fullName: faker.name.fullName(),
  providerUuid: null,
  avatarUrl: faker.image.imageUrl(),
  avatarKey: faker.datatype.uuid(),
  document: faker.random.alphaNumeric(10),
  emailVerified: faker.datatype.boolean(),
  phoneNumber: faker.phone.number('## # ####-####'),
  phoneNumber1: faker.phone.number('## # ####-####'),
  type: 'individual',
  city: faker.address.city(),
  state: 'RN',
  zipCode: faker.address.zipCode(),
  line1: faker.address.streetAddress(),
  line2: faker.address.secondaryAddress(),
  pagarmeUserId: faker.random.alphaNumeric(10),
  pagarmeAddressId: faker.random.alphaNumeric(10),
  uuid: faker.datatype.uuid(),
  createdAt: new Date(),
  updatedAt: undefined,
  deletedAt: undefined,
};
const userList: Partial<User>[] = [userData];

describe('UserController', () => {
  let userController: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(userList),
            create: jest.fn().mockResolvedValue(userData),
          },
        },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });
  describe('findAll', () => {
    it('should return a todo list entity successfully', async () => {
      const result = await userController.findAll();

      expect(result).toEqual([userData]);
      expect(typeof result).toEqual('object');
      expect(userService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(userService, 'findAll').mockRejectedValueOnce(new Error());

      expect(userController.findAll()).rejects.toThrowError();
    });
  });
});
