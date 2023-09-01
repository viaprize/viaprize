import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePactReview1693419530846 implements MigrationInterface {
    name = 'CreatePactReview1693419530846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pacts" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(255) NOT NULL, "terms" text NOT NULL, "address" varchar(42) NOT NULL, "transactionHash" varchar(66) NOT NULL, "blockHash" varchar(66), "networkType" varchar CHECK( "networkType" IN ('testnet','mainnet') ), CONSTRAINT "UQ_7433bf5dca67d517581cac9b7cc" UNIQUE ("address", "transactionHash"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pacts"`);
    }

}
