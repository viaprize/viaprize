import { MigrationInterface, QueryRunner } from 'typeorm';

export class Name1709859540350 implements MigrationInterface {
  name = 'Name1709859540350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD CONSTRAINT "FK_8e813105344c95ba9443c370766" FOREIGN KEY ("id") REFERENCES "portals_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP CONSTRAINT "FK_8e813105344c95ba9443c370766"`,
    );
  }
}
