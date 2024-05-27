import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtraDonationEdit1711828524319 implements MigrationInterface {
  name = 'ExtraDonationEdit1711828524319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "extra_donation_portal_data" DROP COLUMN "donatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "extra_donation_portal_data" ADD "donatedAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "extra_donation_portal_data" DROP COLUMN "donatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "extra_donation_portal_data" ADD "donatedAt" integer NOT NULL`,
    );
  }
}
