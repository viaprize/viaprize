import { MigrationInterface, QueryRunner } from 'typeorm';

export class Participantstocontestants1717576673623
  implements MigrationInterface
{
  name = 'Participantstocontestants1717576673623';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "prize_contestants_user" ("prizeId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_1f40a5416700bec6986635cd97d" PRIMARY KEY ("prizeId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4421512dd8dcd5ba0759ff3e01" ON "prize_contestants_user" ("prizeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_232e14de6c577215d9629808c8" ON "prize_contestants_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_contestants_user" ADD CONSTRAINT "FK_4421512dd8dcd5ba0759ff3e019" FOREIGN KEY ("prizeId") REFERENCES "prize"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_contestants_user" ADD CONSTRAINT "FK_232e14de6c577215d9629808c81" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prize_contestants_user" DROP CONSTRAINT "FK_232e14de6c577215d9629808c81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_contestants_user" DROP CONSTRAINT "FK_4421512dd8dcd5ba0759ff3e019"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_232e14de6c577215d9629808c8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4421512dd8dcd5ba0759ff3e01"`,
    );
    await queryRunner.query(`DROP TABLE "prize_contestants_user"`);
  }
}
