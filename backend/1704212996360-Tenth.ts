import { MigrationInterface, QueryRunner } from "typeorm";

export class Tenth1704212996360 implements MigrationInterface {
    name = 'Tenth1704212996360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portal_proposals" ADD "platformFeePercentage" integer NOT NULL DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD "platformFeePercentage" integer NOT NULL DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD "proposerFeePercentage" integer NOT NULL DEFAULT '5'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP COLUMN "proposerFeePercentage"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP COLUMN "platformFeePercentage"`);
        await queryRunner.query(`ALTER TABLE "portal_proposals" DROP COLUMN "platformFeePercentage"`);
    }

}
