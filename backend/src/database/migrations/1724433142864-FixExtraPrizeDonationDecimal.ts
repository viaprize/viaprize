import { MigrationInterface, QueryRunner } from "typeorm";

export class FixExtraPrizeDonationDecimal1724433142864 implements MigrationInterface {
    name = 'FixExtraPrizeDonationDecimal1724433142864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_donation_prize_data" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "extra_donation_prize_data" ADD "value" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_donation_prize_data" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "extra_donation_prize_data" ADD "value" integer NOT NULL`);
    }

}
