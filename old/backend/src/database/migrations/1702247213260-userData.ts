import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserData1702247213260 implements MigrationInterface {
  name = 'UserData1702247213260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "avatar" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "proficiencies" text NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "priorities" text NOT NULL DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "priorities"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "proficiencies"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
  }
}
