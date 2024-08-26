import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tenth1704222486272 implements MigrationInterface {
  name = 'Tenth1704222486272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prize_proposals" ADD "proposerFeePercentage" integer NOT NULL DEFAULT '5'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prize_proposals" DROP COLUMN "proposerFeePercentage"`,
    );
  }
}
