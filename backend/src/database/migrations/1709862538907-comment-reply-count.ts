import { MigrationInterface, QueryRunner } from "typeorm";

export class CommentReplyCount1709862538907 implements MigrationInterface {
    name = 'CommentReplyCount1709862538907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portals_comments" ADD "reply_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portals_comments" DROP COLUMN "reply_count"`);
    }

}
