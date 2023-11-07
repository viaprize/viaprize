import { MigrationInterface, QueryRunner } from 'typeorm';

export class Thrid1699187831677 implements MigrationInterface {
  name = 'Thrid1699187831677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "prize" ADD "user" character varying`);
    await queryRunner.query(
      `ALTER TABLE "prize" ADD CONSTRAINT "FK_457605041e9833526c8ce10e8b5" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prize" DROP CONSTRAINT "FK_457605041e9833526c8ce10e8b5"`,
    );
    await queryRunner.query(`ALTER TABLE "prize" DROP COLUMN "user"`);
  }
}
