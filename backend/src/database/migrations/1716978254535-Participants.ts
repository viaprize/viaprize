import { MigrationInterface, QueryRunner } from 'typeorm';

export class Participants1716978254535 implements MigrationInterface {
  name = 'Participants1716978254535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "prize_parcipants_user" ("prizeId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_4c51a9213f0bfa1fdcc9b582f3e" PRIMARY KEY ("prizeId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_32d22e6ae2cec0cc12727cb908" ON "prize_parcipants_user" ("prizeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7f201d767122070a48654012c2" ON "prize_parcipants_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_parcipants_user" ADD CONSTRAINT "FK_32d22e6ae2cec0cc12727cb9088" FOREIGN KEY ("prizeId") REFERENCES "prize"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_parcipants_user" ADD CONSTRAINT "FK_7f201d767122070a48654012c27" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prize_parcipants_user" DROP CONSTRAINT "FK_7f201d767122070a48654012c27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_parcipants_user" DROP CONSTRAINT "FK_32d22e6ae2cec0cc12727cb9088"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7f201d767122070a48654012c2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_32d22e6ae2cec0cc12727cb908"`,
    );
    await queryRunner.query(`DROP TABLE "prize_parcipants_user"`);
  }
}
