import { MigrationInterface, QueryRunner } from 'typeorm';

export class First1696139792816 implements MigrationInterface {
  name = 'First1696139792816';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "prize_proposals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "voting_time" integer NOT NULL, "submission_time" integer NOT NULL, "admins" text NOT NULL, "isApproved" boolean NOT NULL DEFAULT false, "title" character varying NOT NULL DEFAULT '', "description" text NOT NULL, "isAutomatic" boolean, "startVotingDate" TIMESTAMP, "startSubmissionDate" TIMESTAMP, "proficiencies" text NOT NULL, "priorities" text NOT NULL, "images" text NOT NULL, "user" character varying, CONSTRAINT "PK_609007d09bec84bdd3a580aac5f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "authId" character varying NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_ad5065ee18a722baaa932d1c3c6" UNIQUE ("authId"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ad5065ee18a722baaa932d1c3c" ON "user" ("authId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "submissionTitle" character varying NOT NULL, "subimissionDescription" json NOT NULL, "userId" uuid, "prizeId" uuid, CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "prize" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "isAutomatic" boolean NOT NULL, "startVotingDate" TIMESTAMP, "startSubmissionDate" TIMESTAMP, "proposer_address" character varying NOT NULL, "contract_address" character varying NOT NULL, "admins" text NOT NULL, "proficiencies" text NOT NULL, "priorities" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ed6e4960a2fb62a3fa2025074fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "terms" text NOT NULL, "address" character varying(42) NOT NULL, "transactionHash" character varying(66) NOT NULL, "blockHash" character varying(66), CONSTRAINT "PK_d0ec8de1adc545b4f849e616f9b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_proposals" ADD CONSTRAINT "FK_5e59db131371ae557edfc20abad" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD CONSTRAINT "FK_7bd626272858ef6464aa2579094" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD CONSTRAINT "FK_08203ca88cf6073248a35a5b57b" FOREIGN KEY ("prizeId") REFERENCES "prize"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submission" DROP CONSTRAINT "FK_08203ca88cf6073248a35a5b57b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" DROP CONSTRAINT "FK_7bd626272858ef6464aa2579094"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_proposals" DROP CONSTRAINT "FK_5e59db131371ae557edfc20abad"`,
    );
    await queryRunner.query(`DROP TABLE "pact"`);
    await queryRunner.query(`DROP TABLE "prize"`);
    await queryRunner.query(`DROP TABLE "submission"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ad5065ee18a722baaa932d1c3c"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "prize_proposals"`);
  }
}
