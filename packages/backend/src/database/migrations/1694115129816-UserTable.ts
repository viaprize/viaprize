import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1694115129816 implements MigrationInterface {
    name = 'UserTable1694115129816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "address" varchar NOT NULL, CONSTRAINT "UQ_3122b4b8709577da50e89b68983" UNIQUE ("address"))`);
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
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
