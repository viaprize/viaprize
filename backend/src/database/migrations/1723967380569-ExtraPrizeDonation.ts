import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtraPrizeDonation1723967380569 implements MigrationInterface {
  name = 'ExtraPrizeDonation1723967380569';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "extra_donation_prize_data" ("id" SERIAL NOT NULL, "donatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "donor" character varying NOT NULL, "value" integer NOT NULL, "valueIn" character varying NOT NULL, "externalId" character varying NOT NULL, CONSTRAINT "PK_c0091b2f09065f501869187049e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "extra_prize" ("id" SERIAL NOT NULL, "fundsUsd" integer NOT NULL, "fundsInBtc" integer NOT NULL, "fundsInEth" integer NOT NULL, "fundsInSol" integer NOT NULL, "externalId" character varying NOT NULL, CONSTRAINT "PK_98dcbbc93d16f15e23abaf761ba" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "extra_prize"`);
    await queryRunner.query(`DROP TABLE "extra_donation_prize_data"`);
  }
}
