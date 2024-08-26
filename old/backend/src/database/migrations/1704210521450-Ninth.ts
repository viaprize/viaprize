import { MigrationInterface, QueryRunner } from 'typeorm';

export class Ninth1704210521450 implements MigrationInterface {
  name = 'Ninth1704210521450';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prize_proposals" ADD "platformFeePercentage" integer NOT NULL DEFAULT '5'`,
    );
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" ADD "platformFeePercentage" integer NOT NULL DEFAULT '5'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" DROP COLUMN "platformFeePercentage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_proposals" DROP COLUMN "platformFeePercentage"`,
    );
  }
}
