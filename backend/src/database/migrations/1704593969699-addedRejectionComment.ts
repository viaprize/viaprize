import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedRejectionComment1704593969699 implements MigrationInterface {
  name = 'AddedRejectionComment1704593969699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" ADD "rejectionComment" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" DROP COLUMN "rejectionComment"`,
    );
  }
}
