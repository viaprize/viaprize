import { MigrationInterface, QueryRunner } from 'typeorm';

export class Judges1706302171391 implements MigrationInterface {
  name = 'Judges1706302171391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prize_proposals" ADD "judges" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize" ADD "judges" text array NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "prize" DROP COLUMN "judges"`);
    await queryRunner.query(
      `ALTER TABLE "prize_proposals" DROP COLUMN "judges"`,
    );
  }
}
