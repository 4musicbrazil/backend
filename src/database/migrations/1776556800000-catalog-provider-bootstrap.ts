import { MigrationInterface, QueryRunner } from 'typeorm';

export class CatalogProviderBootstrap1776556800000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_key varchar;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_url varchar;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS price varchar;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS provider varchar DEFAULT 'uappi';
      ALTER TABLE products ADD COLUMN IF NOT EXISTS external_image_url varchar;
      UPDATE products SET provider = COALESCE(NULLIF(provider, ''), 'uappi');
    `);

    await queryRunner.query(`
      ALTER TABLE galleries ADD COLUMN IF NOT EXISTS name varchar;
    `);

    await queryRunner.query(`
      ALTER TABLE "references"
      ALTER COLUMN product_id TYPE uuid USING NULLIF(product_id::text, '')::uuid,
      ALTER COLUMN item_reference_id TYPE uuid USING NULLIF(item_reference_id::text, '')::uuid,
      ALTER COLUMN group_id TYPE uuid USING NULLIF(group_id::text, '')::uuid;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "references"
      ALTER COLUMN product_id TYPE varchar USING product_id::varchar,
      ALTER COLUMN item_reference_id TYPE varchar USING item_reference_id::varchar,
      ALTER COLUMN group_id TYPE varchar USING group_id::varchar;
    `);

    await queryRunner.query(`
      ALTER TABLE products DROP COLUMN IF EXISTS external_image_url;
      ALTER TABLE products DROP COLUMN IF EXISTS provider;
    `);
  }
}
