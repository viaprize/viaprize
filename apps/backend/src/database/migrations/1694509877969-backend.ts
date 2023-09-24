import { MigrationInterface, QueryRunner } from 'typeorm';

export class Backend1694509877969 implements MigrationInterface {
  name = 'Backend1694509877969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isAdmin" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAdmin"`);
  }
}
