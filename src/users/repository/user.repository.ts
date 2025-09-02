import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import USER_FIELDS from '../fields/select-filds-user';

@Injectable()
export class UserRepository {
  private readonly props: any = { select: [...USER_FIELDS] };
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async existsByUuidOrEmail(
    userUuid: string | boolean,
    email: string | boolean,
  ): Promise<boolean> {
    const where = [];

    if (userUuid) {
      where.push({ userUuid });
    }
    if (email) {
      where.push({ email: email });
    }
    return await this.userRepository.exist({
      where: Object.assign({}, ...where),
    });
  }
  async findOneByEmail(email: string, withPassword: boolean): Promise<User> {
    try {
      if (withPassword) {
        this.props.select = [...this.props.select, 'password'];
      }
      return this.userRepository.findOne({
        where: { email: email },
        ...this.props,
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }
  async findOne(userUuid: string): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { uuid: userUuid },
        ...this.props,
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }
  async create(user: Partial<User>): Promise<User> {
    try {
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }

  async findAll(
    search: string,
    orderBy: string,
    skip: string,
    take: string,
  ): Promise<User[]> {
    try {
      const where: Record<string, any>[] = []; // Um array de condições

      if (search && search !== 'null') {
        where.push({ fullName: ILike(`%${search}%`) });
        where.push({ email: ILike(`%${search}%`) });
      }

      // Define ordenação
      const order = { orderBy: orderBy ?? 'ASC' };

      // Define os limites de paginação
      const maxSkip = skip ? parseInt(skip, 10) : 0;
      const maxTake = take ? parseInt(take, 10) : 10;

      // Exibe as condições de busca no console
      // console.log(order);

      return await this.userRepository.find({
        where: where.length > 0 ? where : undefined, // Adiciona o where apenas se houver condições
        // order,
        skip: maxSkip,
        take: maxTake,
        ...this.props,
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }

  async update(userUpdate: Partial<User>): Promise<User> {
    try {
      const { uuid } = await this.userRepository.save(userUpdate);
      return await this.findOne(uuid);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
  async remove(userUuid: string): Promise<User> {
    try {
      await this.userRepository.softDelete({ uuid: userUuid });
      return await this.userRepository.findOne({
        where: {
          uuid: userUuid,
        },
        withDeleted: true,
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.CONFLICT);
    }
  }
  async findOneByProvideUuidAndEmail(
    providerUuid: string,
    email: string,
    withDeleted: boolean,
  ): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { providerUuid: providerUuid, email: email },
        withDeleted: withDeleted,
        ...this.props,
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }

  async findOneByUuidAndEmail(
    userUuid: string,
    userEmail: string,
  ): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { uuid: userUuid, email: userEmail },
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.NOT_FOUND);
    }
  }
}
