import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDecimalExtra1724422647080 implements MigrationInterface {
    name = 'FixDecimalExtra1724422647080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_prize" DROP COLUMN "externalId"`);
        await queryRunner.query(`ALTER TABLE "extra_prize" ADD "externalId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_prize" DROP COLUMN "externalId"`);
        await queryRunner.query(`ALTER TABLE "extra_prize" ADD "externalId" numeric NOT NULL`);
    }

}
