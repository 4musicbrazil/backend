import { MigrationInterface, QueryRunner } from 'typeorm';

export class Role1689362476705 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE roles (
        uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar,    
        created_at timestamp DEFAULT NOW()::TIMESTAMP,
        updated_at timestamp,
        deleted_at timestamp
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE roles CASCADE`);
  }
}
