import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtraPortal1711785612455 implements MigrationInterface {
  name = 'ExtraPortal1711785612455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "extra_portal" ("id" SERIAL NOT NULL, "funds" integer NOT NULL, "externalId" character varying NOT NULL, CONSTRAINT "PK_538cb560bd29842dd447c1a252f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "extra_portal"`);
  }
}
