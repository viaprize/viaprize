import { MigrationInterface, QueryRunner } from 'typeorm';

export class Comments1709373186006 implements MigrationInterface {
  name = 'Comments1709373186006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD "parent_comment_id" integer`,
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
      `ALTER TABLE "portals_comments" DROP COLUMN "parent_comment_id"`,
    );
  }
}
