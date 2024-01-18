import { MigrationInterface, QueryRunner } from "typeorm";

export class FundingGoalPlatformfee21705572055464 implements MigrationInterface {
    name = 'FundingGoalPlatformfee21705572055464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portals" ADD "fundingGoalWithPlatformFee" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portals" DROP COLUMN "fundingGoalWithPlatformFee"`);
    }

}
