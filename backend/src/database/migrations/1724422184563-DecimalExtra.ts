import { MigrationInterface, QueryRunner } from "typeorm";

export class DecimalExtra1724422184563 implements MigrationInterface {
    name = 'DecimalExtra1724422184563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_prize" DROP COLUMN "fundsUsd"`);
        await queryRunner.query(`ALTER TABLE "extra_prize" ADD "fundsUsd" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "extra_prize" DROP COLUMN "fundsInBtc"`);
        await queryRunner.query(`ALTER TABLE "extra_prize" ADD "fundsInBtc" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "extra_prize" DROP COLUMN "fundsInEth"`);
        await queryRunner.query(`ALTER TABLE "extra_prize" ADD "fundsInEth" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "extra_prize" DROP COLUMN "fundsInSol"`);
        await queryRunner.query(`ALTER TABLE "extra_prize" ADD "fundsInSol" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "extra_prize" DROP COLUMN "externalId"`);
        await queryRunner.query(`ALTER TABLE "extra_prize" ADD "externalId" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_prize" DROP COLUMN "externalId"`);
        await queryRunner.query(`ALTER TABLE "extra_prize" ADD "externalId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "extra_prize" DROP COLUMN "fundsInSol"`);
        await queryRunner.query(`ALTER TABLE "extra_prize" ADD "fundsInSol" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "extra_prize" DROP COLUMN "fundsInEth"`);
        await queryRunner.query(`ALTER TABLE "extra_prize" ADD "fundsInEth" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "extra_prize" DROP COLUMN "fundsInBtc"`);
        await queryRunner.query(`ALTER TABLE "extra_prize" ADD "fundsInBtc" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "extra_prize" DROP COLUMN "fundsUsd"`);
        await queryRunner.query(`ALTER TABLE "extra_prize" ADD "fundsUsd" integer NOT NULL`);
    }

}
