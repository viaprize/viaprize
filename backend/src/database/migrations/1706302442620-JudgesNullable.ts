import { MigrationInterface, QueryRunner } from "typeorm";

export class JudgesNullable1706302442620 implements MigrationInterface {
    name = 'JudgesNullable1706302442620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prize_proposals" ALTER COLUMN "judges" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ALTER COLUMN "judges" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "prize" ALTER COLUMN "judges" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prize" ALTER COLUMN "judges" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prize" ALTER COLUMN "judges" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "prize" ALTER COLUMN "judges" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ALTER COLUMN "judges" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ALTER COLUMN "judges" SET NOT NULL`);
    }

}
