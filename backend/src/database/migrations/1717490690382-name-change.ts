import { MigrationInterface, QueryRunner } from 'typeorm';

export class NameChange1717490690382 implements MigrationInterface {
  name = 'NameChange1717490690382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "prize_participants_user" ("prizeId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_0ab1f64a11a08b48858aa4ae74f" PRIMARY KEY ("prizeId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0129f8fb2dc4fff4d3e60d7eac" ON "prize_participants_user" ("prizeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8ae53d2150877a4dda512554aa" ON "prize_participants_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_participants_user" ADD CONSTRAINT "FK_0129f8fb2dc4fff4d3e60d7eac9" FOREIGN KEY ("prizeId") REFERENCES "prize"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_participants_user" ADD CONSTRAINT "FK_8ae53d2150877a4dda512554aaa" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prize_participants_user" DROP CONSTRAINT "FK_8ae53d2150877a4dda512554aaa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_participants_user" DROP CONSTRAINT "FK_0129f8fb2dc4fff4d3e60d7eac9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8ae53d2150877a4dda512554aa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0129f8fb2dc4fff4d3e60d7eac"`,
    );
    await queryRunner.query(`DROP TABLE "prize_participants_user"`);
  }
}
