import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gallery1729198565843 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE galleries (
          uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
            gallery_key varchar,
            gallery_url varchar,
            type varchar,
            description varchar,
            duration varchar,
            created_at timestamp DEFAULT NOW()::TIMESTAMP,
            updated_at timestamp,
            deleted_at timestamp
          ) ;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DROP TABLE IF EXISTS galleries;
        `);
  }
}
