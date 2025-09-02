import { User } from '../entities/user.entity';

export abstract class UserInterfaceRepository {
  abstract existsByUuidOrEmail(
    userUuid: string | boolean,
    email: string | boolean,
  ): Promise<boolean>;
  abstract findOneByEmail(email: string, withPassword: boolean): Promise<User>;
  abstract findOne(userUuid: string): Promise<User>;
  abstract create(user: Partial<User>): Promise<User>;
  abstract findAll(
    search: string,
    orderBy: string,
    skip: string,
    take: string,
  ): Promise<User[]>;
  abstract update(userUpdate: Partial<User>): Promise<User>;
  abstract remove(userUuid: string): Promise<User>;
  abstract findOneByProvideUuidAndEmail(
    providerUuid: string,
    email: string,
    withDeleted: boolean,
  ): Promise<User>;
  abstract findOneByUuidAndEmail(
    userUuid: string,
    userEmail: string,
  ): Promise<User>;
}
