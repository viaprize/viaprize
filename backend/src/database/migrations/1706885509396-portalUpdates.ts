import { MigrationInterface, QueryRunner } from 'typeorm';

export class PortalUpdates1706885509396 implements MigrationInterface {
  name = 'PortalUpdates1706885509396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portals" ADD "updates" text NOT NULL DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "portals" DROP COLUMN "updates"`);
  }
}
