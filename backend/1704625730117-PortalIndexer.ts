import { MigrationInterface, QueryRunner } from "typeorm";

export class PortalIndexer1704625730117 implements MigrationInterface {
    name = 'PortalIndexer1704625730117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "portal_index" ("id" SERIAL NOT NULL, "jobId" integer NOT NULL, "contract_address" character varying NOT NULL, "totalFunds" integer NOT NULL, "balance" integer NOT NULL, "totalRewards" integer NOT NULL, "isActive" boolean NOT NULL, "portalId" uuid, CONSTRAINT "REL_8e6988015128e40952737f59c3" UNIQUE ("portalId"), CONSTRAINT "PK_c4518368eab1753c08e0624351f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "portal_proposals" DROP COLUMN "rejectionComment"`);
        await queryRunner.query(`ALTER TABLE "portal_index" ADD CONSTRAINT "FK_8e6988015128e40952737f59c31" FOREIGN KEY ("portalId") REFERENCES "portals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portal_index" DROP CONSTRAINT "FK_8e6988015128e40952737f59c31"`);
        await queryRunner.query(`ALTER TABLE "portal_proposals" ADD "rejectionComment" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`DROP TABLE "portal_index"`);
    }

}
