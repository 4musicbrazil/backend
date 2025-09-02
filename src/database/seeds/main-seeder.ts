import { DataSource } from 'typeorm';
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension';

import { UserSeeder } from './user.seed';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const connection = dataSource;

    // Truncate tables with mysql/marianDb tables
    // await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    // await connection.query('TRUNCATE TABLE name_table');
    // await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    // Truncate tables with postgres tables
    // await connection.query('TRUNCATE TABLE name_table CASCADE ');

    await runSeeder(dataSource, UserSeeder);
  }
}
