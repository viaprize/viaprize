import { MigrationInterface, QueryRunner } from "typeorm";

export class CommentTimestamp1709861394868 implements MigrationInterface {
    name = 'CommentTimestamp1709861394868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portals_comments" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "portals_comments" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portals_comments" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "portals_comments" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
