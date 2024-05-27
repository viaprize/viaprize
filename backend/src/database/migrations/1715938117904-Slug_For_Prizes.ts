import { MigrationInterface, QueryRunner } from 'typeorm';

export class SlugForPrizes1715938117904 implements MigrationInterface {
  name = 'SlugForPrizes1715938117904';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "prize" ADD "slug" character varying`);
    await queryRunner.query(
      `ALTER TABLE "prize" ADD CONSTRAINT "UQ_18ecca4876130746b5d2de832fc" UNIQUE ("slug")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f437df460ca595ccedfb080145" ON "portals" ("slug") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_18ecca4876130746b5d2de832f" ON "prize" ("slug") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_18ecca4876130746b5d2de832f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f437df460ca595ccedfb080145"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize" DROP CONSTRAINT "UQ_18ecca4876130746b5d2de832fc"`,
    );
    await queryRunner.query(`ALTER TABLE "prize" DROP COLUMN "slug"`);
  }
}
