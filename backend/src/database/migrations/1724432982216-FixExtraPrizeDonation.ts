import { MigrationInterface, QueryRunner } from "typeorm";

export class FixExtraPrizeDonation1724432982216 implements MigrationInterface {
    name = 'FixExtraPrizeDonation1724432982216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_donation_prize_data" RENAME COLUMN "donatedAt" TO "donationTime"`);
        await queryRunner.query(`ALTER TABLE "extra_donation_prize_data" DROP COLUMN "donationTime"`);
        await queryRunner.query(`ALTER TABLE "extra_donation_prize_data" ADD "donationTime" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_donation_prize_data" DROP COLUMN "donationTime"`);
        await queryRunner.query(`ALTER TABLE "extra_donation_prize_data" ADD "donationTime" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "extra_donation_prize_data" RENAME COLUMN "donationTime" TO "donatedAt"`);
    }

}
