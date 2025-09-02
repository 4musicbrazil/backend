import { MigrationInterface, QueryRunner } from 'typeorm';

export class users1676148085989 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE users (
            uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
            full_name varchar NOT NULL unique,
            email varchar NOT NULL,
            role_uuid UUID NOT NULL,         
            password varchar NOT NULL,          
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp,
            deleted_at timestamp
          );
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users CASCADE`);
  }
}
