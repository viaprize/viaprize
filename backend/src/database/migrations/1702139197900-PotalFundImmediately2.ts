import { MigrationInterface, QueryRunner } from 'typeorm';

export class PotalFundImmediately21702139197900 implements MigrationInterface {
  name = 'PotalFundImmediately21702139197900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portals" ADD "sendImmediately" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" ADD "sendImmediately" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" DROP COLUMN "sendImmediately"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals" DROP COLUMN "sendImmediately"`,
    );
  }
}
