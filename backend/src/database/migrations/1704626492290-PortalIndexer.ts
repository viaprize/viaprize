import { MigrationInterface, QueryRunner } from "typeorm";

export class PortalIndexer1704626492290 implements MigrationInterface {
    name = 'PortalIndexer1704626492290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "portal_index" ("id" SERIAL NOT NULL, "jobId" integer NOT NULL, "contract_address" character varying NOT NULL, "totalFunds" bigint NOT NULL, "balance" bigint NOT NULL, "totalRewards" bigint NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_c4518368eab1753c08e0624351f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "portal_index"`);
    }

}
