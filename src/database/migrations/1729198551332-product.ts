import { MigrationInterface, QueryRunner } from 'typeorm';

export class Product1729198551332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE products (
          uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
            gallery_uuid uuid not null,
            platform_id varchar,
            reference_platform_id varchar,
            name varchar,
            sku varchar,    
            uappi_url_image varchar,
            category varchar,
            description varchar,
            status varchar,
            url varchar,
            created_at timestamp DEFAULT NOW()::TIMESTAMP,
            updated_at timestamp,
            deleted_at timestamp
          ) ;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DROP TABLE IF EXISTS products;
        `);
  }
}
