import { MigrationInterface, QueryRunner } from 'typeorm';

export class Comments1708367205612 implements MigrationInterface {
  name = 'Comments1708367205612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "portals_comments" ("id" SERIAL NOT NULL, "comment" character varying NOT NULL, "user" character varying, "portalId" uuid, CONSTRAINT "PK_8e813105344c95ba9443c370766" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "prizes_comments" ("id" SERIAL NOT NULL, "comment" character varying NOT NULL, "user" character varying, "prizeId" uuid, CONSTRAINT "PK_c11bd3c1f58d6c4a30dd0ac09d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD CONSTRAINT "FK_4b7b65f7c847ec1c537de47421a" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD CONSTRAINT "FK_0d9f7d87500d9a5ca6eea405996" FOREIGN KEY ("portalId") REFERENCES "portals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prizes_comments" ADD CONSTRAINT "FK_61fb29ac6df4ceb134159a8d6ac" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prizes_comments" ADD CONSTRAINT "FK_228c4254f2cb28242fd5d213f9f" FOREIGN KEY ("prizeId") REFERENCES "prize"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prizes_comments" DROP CONSTRAINT "FK_228c4254f2cb28242fd5d213f9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prizes_comments" DROP CONSTRAINT "FK_61fb29ac6df4ceb134159a8d6ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP CONSTRAINT "FK_0d9f7d87500d9a5ca6eea405996"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP CONSTRAINT "FK_4b7b65f7c847ec1c537de47421a"`,
    );
    await queryRunner.query(`DROP TABLE "prizes_comments"`);
    await queryRunner.query(`DROP TABLE "portals_comments"`);
  }
}
