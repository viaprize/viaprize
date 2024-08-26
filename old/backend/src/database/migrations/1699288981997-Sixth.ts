import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sixth1699288981997 implements MigrationInterface {
  name = 'Sixth1699288981997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submission" RENAME COLUMN "subimissionDescription" TO "submissionDescription"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submission" RENAME COLUMN "submissionDescription" TO "subimissionDescription"`,
    );
  }
}
