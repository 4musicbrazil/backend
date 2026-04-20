import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';

import { Role } from '../../role/entities/role.entity';
import { User } from '../../users/entities/user.entity';

export class UserSeeder implements Seeder {
  private readonly SALT_OR_ROUNDS = +process.env.SALT_OR_ROUNDS;

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    const existingUser = await userRepository.findOne({
      where: { email: 'jhoeDue@example.com' },
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
      email: 'jhoeDue@example.com',
      fullName: 'App4Music Owner',
      roleUuid: ownerRole.uuid,
      password: await this.hashPassword('Password1!'),
    });

    await userRepository.save(newUser);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_OR_ROUNDS);
  }
}
