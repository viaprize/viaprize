import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1694246436464 implements MigrationInterface {
    name = 'Migrations1694246436464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "prize_proposals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "platform_reward" integer, "distributed" boolean NOT NULL DEFAULT false, "voting_time" integer NOT NULL, "submission_time" integer NOT NULL, "admins" text NOT NULL, "isApproved" boolean NOT NULL DEFAULT false, "description" text NOT NULL, "startVotingDate" TIMESTAMP, "startSubmissionDate" TIMESTAMP, "proposer_address" character varying NOT NULL, "proficiencies" text NOT NULL, "priorities" text NOT NULL, CONSTRAINT "PK_609007d09bec84bdd3a580aac5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pacts_networktype_enum" AS ENUM('testnet', 'mainnet')`);
        await queryRunner.query(`CREATE TABLE "pacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "terms" text NOT NULL, "address" character varying(42) NOT NULL, "transactionHash" character varying(66) NOT NULL, "blockHash" character varying(66), "networkType" "public"."pacts_networktype_enum", CONSTRAINT "UQ_7433bf5dca67d517581cac9b7cc" UNIQUE ("address", "transactionHash"), CONSTRAINT "PK_8fc613c47ff1d0b3229172749e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prize" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "startVotingDate" TIMESTAMP, "startSubmissionDate" TIMESTAMP, "proposer_address" character varying NOT NULL, "contract_address" character varying NOT NULL, "admins" text NOT NULL, "proficiencies" text NOT NULL, "priorities" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ed6e4960a2fb62a3fa2025074fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "submissionTitle" character varying NOT NULL, "subimissionDescription" json NOT NULL, "userId" uuid, "prizeId" uuid, CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying NOT NULL, "email" character varying NOT NULL, "userId" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_3122b4b8709577da50e89b68983" UNIQUE ("address"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_d72ea127f30e21753c9e229891e" UNIQUE ("userId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_7bd626272858ef6464aa2579094" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_08203ca88cf6073248a35a5b57b" FOREIGN KEY ("prizeId") REFERENCES "prize"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_08203ca88cf6073248a35a5b57b"`);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_7bd626272858ef6464aa2579094"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "submission"`);
        await queryRunner.query(`DROP TABLE "prize"`);
        await queryRunner.query(`DROP TABLE "pacts"`);
        await queryRunner.query(`DROP TYPE "public"."pacts_networktype_enum"`);
        await queryRunner.query(`DROP TABLE "prize_proposals"`);
    }

}
