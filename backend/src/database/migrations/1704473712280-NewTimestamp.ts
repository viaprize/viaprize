import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTimestamp1704473712280 implements MigrationInterface {
  name = 'NewTimestamp1704473712280';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" DROP COLUMN "deadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" ADD "deadline" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "portals" DROP COLUMN "deadline"`);
    await queryRunner.query(
      `ALTER TABLE "portals" ADD "deadline" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "portals" DROP COLUMN "deadline"`);
    await queryRunner.query(`ALTER TABLE "portals" ADD "deadline" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" DROP COLUMN "deadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" ADD "deadline" TIMESTAMP`,
    );
  }
}
