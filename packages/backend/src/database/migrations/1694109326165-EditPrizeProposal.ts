import { MigrationInterface, QueryRunner } from "typeorm";

export class EditPrizeProposal1694109326165 implements MigrationInterface {
    name = 'EditPrizeProposal1694109326165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "prize_proposals" ("id" varchar PRIMARY KEY NOT NULL, "platform_reward" integer, "distributed" boolean NOT NULL DEFAULT (0), "voting_time" integer NOT NULL, "submission_time" integer NOT NULL, "admins" text NOT NULL, "isApproved" boolean NOT NULL DEFAULT (0), "description" text NOT NULL, "proposer_address" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_pacts" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(255) NOT NULL, "terms" text NOT NULL, "address" varchar(42) NOT NULL, "transactionHash" varchar(66) NOT NULL, "blockHash" varchar(66), "networkType" varchar CHECK( "networkType" IN ('testnet','mainnet') ), CONSTRAINT "UQ_7433bf5dca67d517581cac9b7cc" UNIQUE ("address", "transactionHash"))`);
        await queryRunner.query(`INSERT INTO "temporary_pacts"("id", "name", "terms", "address", "transactionHash", "blockHash", "networkType") SELECT "id", "name", "terms", "address", "transactionHash", "blockHash", "networkType" FROM "pacts"`);
        await queryRunner.query(`DROP TABLE "pacts"`);
        await queryRunner.query(`ALTER TABLE "temporary_pacts" RENAME TO "pacts"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pacts" RENAME TO "temporary_pacts"`);
        await queryRunner.query(`CREATE TABLE "pacts" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(255) NOT NULL, "terms" text NOT NULL, "address" varchar(42) NOT NULL, "transactionHash" varchar(66) NOT NULL, "blockHash" varchar(66), "networkType" varchar CHECK( "networkType" IN ('testnet','mainnet') ), CONSTRAINT "UQ_7433bf5dca67d517581cac9b7cc" UNIQUE ("address", "transactionHash"))`);
        await queryRunner.query(`INSERT INTO "pacts"("id", "name", "terms", "address", "transactionHash", "blockHash", "networkType") SELECT "id", "name", "terms", "address", "transactionHash", "blockHash", "networkType" FROM "temporary_pacts"`);
        await queryRunner.query(`DROP TABLE "temporary_pacts"`);
        await queryRunner.query(`DROP TABLE "prize_proposals"`);
    }

}
