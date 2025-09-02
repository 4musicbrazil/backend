import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
export class UserSeeder implements Seeder {
  private readonly SALT_OR_ROUNDS = +process.env.SALT_OR_ROUNDS;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const userData: Partial<User> = {
      email: 'jhoeDue@example.com',
      password: await this.hashPassword('Password1!'),
      fullName: faker.name.fullName(),
    };

    const newUser = userRepository.create(userData);
    await userRepository.save(newUser);
  }
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_OR_ROUNDS);
  }
}
