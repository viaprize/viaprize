import { MigrationInterface, QueryRunner } from 'typeorm';

export class Forth1699213186487 implements MigrationInterface {
  name = 'Forth1699213186487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prize" ADD "submissionTime" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize" ADD "votingTime" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "prize" ADD "images" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "prize" ADD "title" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "prize" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "prize" DROP COLUMN "images"`);
    await queryRunner.query(`ALTER TABLE "prize" DROP COLUMN "votingTime"`);
    await queryRunner.query(`ALTER TABLE "prize" DROP COLUMN "submissionTime"`);
  }
}
