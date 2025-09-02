import { MigrationInterface, QueryRunner } from 'typeorm';

export class Reference1729198530903 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "references" (
            uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            product_id VARCHAR NOT NULL,
            item_reference_id VARCHAR,
            group_id VARCHAR,
            type VARCHAR,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            deleted_at TIMESTAMP DEFAULT NULL
        );

        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DROP TABLE IF EXISTS products_references;
        `);
  }
}
