import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seveth1701716798697 implements MigrationInterface {
  name = 'Seveth1701716798697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submission" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "bio" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
    await queryRunner.query(
      `ALTER TABLE "submission" DROP COLUMN "created_at"`,
    );
  }
}
