import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtraDonation1711827292133 implements MigrationInterface {
    name = 'ExtraDonation1711827292133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "extra_donation_portal_data" ("id" SERIAL NOT NULL, "donatedAt" integer NOT NULL, "donor" character varying NOT NULL, "usdValue" integer NOT NULL, "externalId" character varying NOT NULL, CONSTRAINT "PK_2487716223fd371642f5cc36983" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "extra_donation_portal_data"`);
    }

}
