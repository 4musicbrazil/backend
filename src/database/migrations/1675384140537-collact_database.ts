import { MigrationInterface, QueryRunner } from 'typeorm';

export class collactDatabase1677384140537 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
    // await queryRunner.query(`
    //     ALTER DATABASE usadosnordeste CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
    //           `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}
