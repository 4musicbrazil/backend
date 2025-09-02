import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserInterfaceRepository } from './repository/user.interface.repository';
import { RoleService } from '../role/role.service';

@Injectable()
export class UsersService {
  private readonly SALT_OR_ROUNDS = +process.env.SALT_OR_ROUNDS;

  constructor(
    private readonly userInterfaceRepository: UserInterfaceRepository,
    private readonly roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const userEmail: string | boolean = createUserDto?.email ?? false;

    const exists = await this.userInterfaceRepository.existsByUuidOrEmail(
      false,
      userEmail,
    );

    if (exists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const role = await this.roleService.getAdminOwner();
    try {
      const userData = {
        ...createUserDto,
        roleUuid: role.uuid,
        password: await this.hashPassword(createUserDto.password),
      };
      return await this.userInterfaceRepository.create(userData);
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT);
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.SALT_OR_ROUNDS);
    } catch {
      throw new HttpException(
        'Error while hashing password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    search: string,
    orderBy: string,
    skip: string,
    take: string,
  ): Promise<User[]> {
    try {
      return await this.userInterfaceRepository.findAll(
        search,
        orderBy,
        skip,
        take,
      );
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async findOne(userUuid: string): Promise<any> {
    try {
      return await this.userInterfaceRepository.findOne(userUuid);
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async update(userUuid: string, updateUser: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userInterfaceRepository.findOne(userUuid);
      if (!user) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      user.updatedAt = new Date();
      return await this.userInterfaceRepository.update(user);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async remove(userUuid: string): Promise<User> {
    try {
      const user = await this.findOne(userUuid);
      if (!user) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      return await this.userInterfaceRepository.remove(userUuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getByProviderAndEmail(
    providerUuid: string,
    email: string,
  ): Promise<User> {
    try {
      return await this.userInterfaceRepository.findOneByProvideUuidAndEmail(
        providerUuid,
        email,
        true,
      );
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }

  async findOneByEmail(email: string, withPassword: boolean): Promise<User> {
    return await this.userInterfaceRepository.findOneByEmail(
      email,
      withPassword,
    );
  }

  async findOneByUuidAndEmail(
    userUuid: string,
    userEmail: string,
  ): Promise<User> {
    return await this.userInterfaceRepository.findOneByUuidAndEmail(
      userUuid,
      userEmail,
    );
  }
}
