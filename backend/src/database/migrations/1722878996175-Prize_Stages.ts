import { MigrationInterface, QueryRunner } from "typeorm";

export class PrizeStages1722878996175 implements MigrationInterface {
    name = 'PrizeStages1722878996175'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."prize_stage_enum" AS ENUM('not started', 'submission started', 'submission ended', 'voting started', 'voting ended', 'prize distributed', 'prize ended')`);
        await queryRunner.query(`ALTER TABLE "prize" ADD "stage" "public"."prize_stage_enum" NOT NULL DEFAULT 'not started'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prize" DROP COLUMN "stage"`);
        await queryRunner.query(`DROP TYPE "public"."prize_stage_enum"`);
    }

}
