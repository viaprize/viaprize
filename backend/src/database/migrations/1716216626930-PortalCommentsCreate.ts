import { MigrationInterface, QueryRunner } from "typeorm";

export class PortalCommentsCreate1716216626930 implements MigrationInterface {
    name = 'PortalCommentsCreate1716216626930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "portals_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comment" character varying NOT NULL, "likes" text array NOT NULL DEFAULT '{}', "dislikes" text array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "reply_count" integer NOT NULL DEFAULT '0', "parent_id" uuid, "user" character varying, "portalId" uuid, CONSTRAINT "PK_8e813105344c95ba9443c370766" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "portals_comments" ADD CONSTRAINT "FK_9c2fff544ff05ae76da0bed5f6b" FOREIGN KEY ("parent_id") REFERENCES "portals_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "portals_comments" ADD CONSTRAINT "FK_4b7b65f7c847ec1c537de47421a" FOREIGN KEY ("user") REFERENCES "user"("authId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "portals_comments" ADD CONSTRAINT "FK_0d9f7d87500d9a5ca6eea405996" FOREIGN KEY ("portalId") REFERENCES "portals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "portals_comments" DROP CONSTRAINT "FK_0d9f7d87500d9a5ca6eea405996"`);
        await queryRunner.query(`ALTER TABLE "portals_comments" DROP CONSTRAINT "FK_4b7b65f7c847ec1c537de47421a"`);
        await queryRunner.query(`ALTER TABLE "portals_comments" DROP CONSTRAINT "FK_9c2fff544ff05ae76da0bed5f6b"`);
        await queryRunner.query(`DROP TABLE "portals_comments"`);
    }

}
