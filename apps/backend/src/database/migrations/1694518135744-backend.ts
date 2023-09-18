import { MigrationInterface, QueryRunner } from "typeorm";

export class Backend1694518135744 implements MigrationInterface {
    name = 'Backend1694518135744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD "title" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP COLUMN "title"`);
    }

}
