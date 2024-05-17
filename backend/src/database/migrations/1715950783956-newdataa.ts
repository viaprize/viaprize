import { MigrationInterface, QueryRunner } from 'typeorm';

export class Newdataa1715950783956 implements MigrationInterface {
  name = 'Newdataa1715950783956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "portal_index" ("id" SERIAL NOT NULL, "jobId" integer NOT NULL, "contract_address" character varying NOT NULL, "totalFunds" bigint NOT NULL, "balance" bigint NOT NULL, "totalRewards" bigint NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_c4518368eab1753c08e0624351f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "extra_portal" ("id" SERIAL NOT NULL, "funds" integer NOT NULL, "externalId" character varying NOT NULL, CONSTRAINT "PK_538cb560bd29842dd447c1a252f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "extra_donation_portal_data" ("id" SERIAL NOT NULL, "donatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "donor" character varying NOT NULL, "usdValue" integer NOT NULL, "externalId" character varying NOT NULL, CONSTRAINT "PK_2487716223fd371642f5cc36983" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "terms" text NOT NULL, "address" character varying(42) NOT NULL, "transactionHash" character varying(66) NOT NULL, "blockHash" character varying(66), CONSTRAINT "PK_d0ec8de1adc545b4f849e616f9b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "portal_proposals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "slug" character varying NOT NULL, "fundingGoal" numeric, "fundingGoalWithPlatformFee" numeric, "isMultiSignatureReciever" boolean NOT NULL, "deadline" TIMESTAMP WITH TIME ZONE, "sendImmediately" boolean NOT NULL DEFAULT false, "allowDonationAboveThreshold" boolean NOT NULL, "termsAndCondition" text NOT NULL, "proposerAddress" character varying NOT NULL, "treasurers" text NOT NULL, "tags" text NOT NULL, "platformFeePercentage" integer NOT NULL DEFAULT '5', "isApproved" boolean NOT NULL DEFAULT false, "isRejected" boolean NOT NULL DEFAULT false, "rejectionComment" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "images" text NOT NULL, "title" character varying NOT NULL DEFAULT '', "user" character varying, CONSTRAINT "UQ_5f48ee9bffb681732d62d8a12dc" UNIQUE ("slug"), CONSTRAINT "PK_ca8fdfb2bba309dc2c129ad5adc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "portals_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comment" character varying NOT NULL, "likes" text array NOT NULL DEFAULT '{}', "dislikes" text array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "reply_count" integer NOT NULL DEFAULT '0', "parent_id" uuid, "user" character varying, "portalId" uuid, CONSTRAINT "PK_8e813105344c95ba9443c370766" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "portals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "slug" character varying NOT NULL, "sendImmediately" boolean NOT NULL, "fundingGoal" numeric, "fundingGoalWithPlatformFee" numeric, "isMultiSignatureReciever" boolean NOT NULL, "deadline" TIMESTAMP WITH TIME ZONE, "allowDonationAboveThreshold" boolean NOT NULL, "termsAndCondition" text NOT NULL, "proposer_address" character varying NOT NULL, "contract_address" character varying NOT NULL, "treasurers" text NOT NULL, "tags" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "images" text NOT NULL, "title" character varying NOT NULL DEFAULT '', "updates" text array, "user" character varying, CONSTRAINT "UQ_f437df460ca595ccedfb0801450" UNIQUE ("slug"), CONSTRAINT "PK_85b8f3d841e5461991291c91706" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f437df460ca595ccedfb080145" ON "portals" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TABLE "prizes_comments" ("id" SERIAL NOT NULL, "comment" character varying NOT NULL, "user" character varying, "prizeId" uuid, CONSTRAINT "PK_c11bd3c1f58d6c4a30dd0ac09d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "submissionDescription" json NOT NULL, "submissionHash" character varying NOT NULL, "submitterAddress" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "prizeId" uuid, CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "prize" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "isAutomatic" boolean NOT NULL, "submissionTime" integer NOT NULL, "votingTime" integer NOT NULL, "startVotingDate" TIMESTAMP, "startSubmissionDate" TIMESTAMP, "proposer_address" character varying NOT NULL, "contract_address" character varying NOT NULL, "admins" text NOT NULL, "judges" text array, "proficiencies" text NOT NULL, "priorities" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "images" text NOT NULL, "title" character varying NOT NULL DEFAULT '', "user" character varying, CONSTRAINT "PK_ed6e4960a2fb62a3fa2025074fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "bio" character varying NOT NULL DEFAULT '', "authId" character varying NOT NULL, "name" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT '', "username" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "proficiencies" text NOT NULL DEFAULT '[]', "priorities" text NOT NULL DEFAULT '[]', "walletAddress" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_ad5065ee18a722baaa932d1c3c6" UNIQUE ("authId"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ad5065ee18a722baaa932d1c3c" ON "user" ("authId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "prize_proposals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "voting_time" integer NOT NULL, "submission_time" integer NOT NULL, "admins" text NOT NULL, "judges" text array, "isApproved" boolean NOT NULL DEFAULT false, "isRejected" boolean NOT NULL DEFAULT false, "title" character varying NOT NULL DEFAULT '', "description" text NOT NULL, "isAutomatic" boolean, "startVotingDate" TIMESTAMP, "startSubmissionDate" TIMESTAMP, "platformFeePercentage" integer NOT NULL DEFAULT '5', "proposerFeePercentage" integer NOT NULL DEFAULT '5', "proficiencies" text NOT NULL, "priorities" text NOT NULL, "images" text NOT NULL, "user" character varying, CONSTRAINT "PK_609007d09bec84bdd3a580aac5f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" ADD CONSTRAINT "FK_bd6e3f039420d9afcc732f4bd82" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD CONSTRAINT "FK_9c2fff544ff05ae76da0bed5f6b" FOREIGN KEY ("parent_id") REFERENCES "portals_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD CONSTRAINT "FK_4b7b65f7c847ec1c537de47421a" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" ADD CONSTRAINT "FK_0d9f7d87500d9a5ca6eea405996" FOREIGN KEY ("portalId") REFERENCES "portals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals" ADD CONSTRAINT "FK_72760c1ba1979d60fbc788c2ceb" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prizes_comments" ADD CONSTRAINT "FK_61fb29ac6df4ceb134159a8d6ac" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prizes_comments" ADD CONSTRAINT "FK_228c4254f2cb28242fd5d213f9f" FOREIGN KEY ("prizeId") REFERENCES "prize"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD CONSTRAINT "FK_7bd626272858ef6464aa2579094" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD CONSTRAINT "FK_08203ca88cf6073248a35a5b57b" FOREIGN KEY ("prizeId") REFERENCES "prize"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize" ADD CONSTRAINT "FK_457605041e9833526c8ce10e8b5" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize_proposals" ADD CONSTRAINT "FK_5e59db131371ae557edfc20abad" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prize_proposals" DROP CONSTRAINT "FK_5e59db131371ae557edfc20abad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prize" DROP CONSTRAINT "FK_457605041e9833526c8ce10e8b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" DROP CONSTRAINT "FK_08203ca88cf6073248a35a5b57b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission" DROP CONSTRAINT "FK_7bd626272858ef6464aa2579094"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prizes_comments" DROP CONSTRAINT "FK_228c4254f2cb28242fd5d213f9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prizes_comments" DROP CONSTRAINT "FK_61fb29ac6df4ceb134159a8d6ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals" DROP CONSTRAINT "FK_72760c1ba1979d60fbc788c2ceb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP CONSTRAINT "FK_0d9f7d87500d9a5ca6eea405996"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP CONSTRAINT "FK_4b7b65f7c847ec1c537de47421a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals_comments" DROP CONSTRAINT "FK_9c2fff544ff05ae76da0bed5f6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" DROP CONSTRAINT "FK_bd6e3f039420d9afcc732f4bd82"`,
    );
    await queryRunner.query(`DROP TABLE "prize_proposals"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ad5065ee18a722baaa932d1c3c"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "prize"`);
    await queryRunner.query(`DROP TABLE "submission"`);
    await queryRunner.query(`DROP TABLE "prizes_comments"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f437df460ca595ccedfb080145"`,
    );
    await queryRunner.query(`DROP TABLE "portals"`);
    await queryRunner.query(`DROP TABLE "portals_comments"`);
    await queryRunner.query(`DROP TABLE "portal_proposals"`);
    await queryRunner.query(`DROP TABLE "pact"`);
    await queryRunner.query(`DROP TABLE "extra_donation_portal_data"`);
    await queryRunner.query(`DROP TABLE "extra_portal"`);
    await queryRunner.query(`DROP TABLE "portal_index"`);
  }
}
