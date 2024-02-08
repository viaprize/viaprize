import { MigrationInterface, QueryRunner } from "typeorm";

export class PortalUpdateNew1707398796943 implements MigrationInterface {
    name = 'PortalUpdateNew1707398796943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portals" DROP COLUMN "updates"`);
        await queryRunner.query(`ALTER TABLE "portals" ADD "updates" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portals" DROP COLUMN "updates"`);
        await queryRunner.query(`ALTER TABLE "portals" ADD "updates" text NOT NULL DEFAULT '[]'`);
    }

}
