import { MigrationInterface, QueryRunner } from 'typeorm';

export class Portals1702067827809 implements MigrationInterface {
  name = 'Portals1702067827809';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "portal_proposals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "slug" character varying NOT NULL, "fundingGoal" numeric, "isMultiSignatureReciever" boolean NOT NULL, "deadline" TIMESTAMP, "allowDonationAboveThreshold" boolean NOT NULL, "termsAndCondition" text NOT NULL, "proposerAddress" character varying NOT NULL, "treasurers" text NOT NULL, "tags" text NOT NULL, "isApproved" boolean NOT NULL DEFAULT false, "isRejected" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "images" text NOT NULL, "title" character varying NOT NULL DEFAULT '', "user" character varying, CONSTRAINT "UQ_5f48ee9bffb681732d62d8a12dc" UNIQUE ("slug"), CONSTRAINT "PK_ca8fdfb2bba309dc2c129ad5adc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "portals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "slug" character varying NOT NULL, "fundingGoal" numeric, "isMultiSignatureReciever" boolean NOT NULL, "deadline" TIMESTAMP, "allowDonationAboveThreshold" boolean NOT NULL, "termsAndCondition" text NOT NULL, "proposer_address" character varying NOT NULL, "contract_address" character varying NOT NULL, "treasurers" text NOT NULL, "tags" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "images" text NOT NULL, "title" character varying NOT NULL DEFAULT '', "user" character varying, CONSTRAINT "UQ_f437df460ca595ccedfb0801450" UNIQUE ("slug"), CONSTRAINT "PK_85b8f3d841e5461991291c91706" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" ADD CONSTRAINT "FK_bd6e3f039420d9afcc732f4bd82" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "portals" ADD CONSTRAINT "FK_72760c1ba1979d60fbc788c2ceb" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portals" DROP CONSTRAINT "FK_72760c1ba1979d60fbc788c2ceb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portal_proposals" DROP CONSTRAINT "FK_bd6e3f039420d9afcc732f4bd82"`,
    );
    await queryRunner.query(`DROP TABLE "portals"`);
    await queryRunner.query(`DROP TABLE "portal_proposals"`);
  }
}
