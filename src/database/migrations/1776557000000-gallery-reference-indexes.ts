import { MigrationInterface, QueryRunner } from 'typeorm';

export class GalleryReferenceIndexes1776557000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_galleries_type ON galleries (type);
      CREATE INDEX IF NOT EXISTS idx_galleries_created_at ON galleries (created_at);
      CREATE INDEX IF NOT EXISTS idx_references_product_id ON "references" (product_id);
      CREATE INDEX IF NOT EXISTS idx_references_item_reference_id ON "references" (item_reference_id);
      CREATE INDEX IF NOT EXISTS idx_references_group_id ON "references" (group_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_references_group_id;
      DROP INDEX IF EXISTS idx_references_item_reference_id;
      DROP INDEX IF EXISTS idx_references_product_id;
      DROP INDEX IF EXISTS idx_galleries_created_at;
      DROP INDEX IF EXISTS idx_galleries_type;
    `);
  }
}
