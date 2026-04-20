import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { Role } from '../../role/entities/role.entity';

export class RoleSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);
    const roles = ['admin', 'owner'];

    for (const name of roles) {
      const existingRole = await roleRepository.findOne({
        where: { name },
      });

      if (!existingRole) {
        await roleRepository.save(roleRepository.create({ name }));
      }
    }
  }
}
