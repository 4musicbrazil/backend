import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';

import { Role } from '../../role/entities/role.entity';
import { User } from '../../users/entities/user.entity';

export class UserSeeder implements Seeder {
  private readonly SALT_OR_ROUNDS = +process.env.SALT_OR_ROUNDS;
  private readonly email = process.env.SEED_OWNER_EMAIL;
  private readonly password = process.env.SEED_OWNER_PASSWORD;
  private readonly fullName =
    process.env.SEED_OWNER_FULL_NAME ?? 'App4Music Owner';

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    if (!this.email || !this.password) {
      throw new Error(
        'SEED_OWNER_EMAIL and SEED_OWNER_PASSWORD are required to seed the owner user',
      );
    }

    const existingUser = await userRepository.findOne({
      where: { email: this.email },
    });
    if (existingUser) {
      return;
    }

    const ownerRole = await roleRepository.findOne({
      where: { name: 'owner' },
    });
    if (!ownerRole) {
      throw new Error('Owner role seed must run before UserSeeder');
    }

    const newUser = userRepository.create({
      email: this.email,
      fullName: this.fullName,
      roleUuid: ownerRole.uuid,
      password: await this.hashPassword(this.password),
    });

    await userRepository.save(newUser);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_OR_ROUNDS);
  }
}
