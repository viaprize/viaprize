import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1702466921118 implements MigrationInterface {
  name = 'Test1702466921118';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prize_proposals" ADD "isRejected" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prize_proposals" DROP COLUMN "isRejected"`,
    );
  }
}
