import { MigrationInterface, QueryRunner } from 'typeorm';

export class tokens1686148085989 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE tokens (
            uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
            token varchar,
            user_uuid uuid,
            expire_in int,
            expire_at timestamp,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp,
            deleted_at timestamp
          );
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tokens CASCADE`);
  }
}
