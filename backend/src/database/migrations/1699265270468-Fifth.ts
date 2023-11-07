import { MigrationInterface, QueryRunner } from 'typeorm';

export class Fifth1699265270468 implements MigrationInterface {
  name = 'Fifth1699265270468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submission" DROP COLUMN "submissionTitle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD "submissionHash" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD "submitterAddress" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submission" DROP COLUMN "submitterAddress"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" DROP COLUMN "submissionHash"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD "submissionTitle" character varying NOT NULL`,
    );
  }
}
