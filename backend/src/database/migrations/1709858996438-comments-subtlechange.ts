import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentsSubtlechange1709858996438 implements MigrationInterface {
  name = 'CommentsSubtlechange1709858996438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD "likes" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD "dislikes" text array NOT NULL DEFAULT '{}'`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "portals_comments" DROP COLUMN "dislikes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP COLUMN "likes"`,
    );
  }
}
