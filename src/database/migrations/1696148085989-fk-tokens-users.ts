import { MigrationInterface, QueryRunner } from 'typeorm';

export class fkTokensUsers1696148085989 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tokens"
      ADD CONSTRAINT "fk_token_user"
      FOREIGN KEY ("user_uuid") REFERENCES "users" ("uuid")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`
    //   ALTER TABLE "tokens"
    //   DROP CONSTRAINT KEY "fk_token_user";
    // `);
  }
}
