import { MigrationInterface, QueryRunner } from 'typeorm';

export class FundingGoalPlatformfee1705516277918 implements MigrationInterface {
  name = 'FundingGoalPlatformfee1705516277918';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" ADD "fundingGoalWithPlatformFee" numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" DROP COLUMN "fundingGoalWithPlatformFee"`,
    );
  }
}
