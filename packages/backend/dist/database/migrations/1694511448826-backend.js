"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backend1694511448826 = void 0;
class Backend1694511448826 {
    constructor() {
        this.name = 'Backend1694511448826';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP CONSTRAINT "FK_c5b1324d0b417e66520d80e6178"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP COLUMN "platform_reward"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP COLUMN "distributed"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD "user_id" uuid`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_758b8ce7c18b9d347461b30228" ON "user" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD CONSTRAINT "FK_54f5a5b6364b9cca43d650883e0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP CONSTRAINT "FK_54f5a5b6364b9cca43d650883e0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_758b8ce7c18b9d347461b30228"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD "distributed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD "platform_reward" integer`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD CONSTRAINT "FK_c5b1324d0b417e66520d80e6178" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.Backend1694511448826 = Backend1694511448826;
//# sourceMappingURL=1694511448826-backend.js.map