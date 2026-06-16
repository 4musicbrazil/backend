import { MigrationInterface, QueryRunner } from 'typeorm';

export class GalleryInternalName1776556900000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE galleries ADD COLUMN IF NOT EXISTS internal_name varchar;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE galleries DROP COLUMN IF EXISTS internal_name;
    `);
  }
}
