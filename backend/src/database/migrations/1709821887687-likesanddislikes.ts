import { MigrationInterface, QueryRunner } from 'typeorm';

export class Likesanddislikes1709821887687 implements MigrationInterface {
  name = 'Likesanddislikes1709821887687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD "likes" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD "dislikes" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD "parent_comment_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP CONSTRAINT "PK_8e813105344c95ba9443c370766"`,
    );
    await queryRunner.query(`ALTER TABLE "portals_comments" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD CONSTRAINT "PK_8e813105344c95ba9443c370766" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD CONSTRAINT "FK_de2fbbfcca46632cefdceef7b18" FOREIGN KEY ("parent_comment_id") REFERENCES "portals_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP CONSTRAINT "FK_de2fbbfcca46632cefdceef7b18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP CONSTRAINT "PK_8e813105344c95ba9443c370766"`,
    );
    await queryRunner.query(`ALTER TABLE "portals_comments" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD CONSTRAINT "PK_8e813105344c95ba9443c370766" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP COLUMN "parent_comment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP COLUMN "dislikes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP COLUMN "likes"`,
    );
  }
}
