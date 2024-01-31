import { MigrationInterface, QueryRunner } from "typeorm";

export class Wallet1706718363589 implements MigrationInterface {
    name = 'Wallet1706718363589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "walletAddress" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "walletAddress"`);
    }

}
