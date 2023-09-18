"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backend1694514918829 = void 0;
class Backend1694514918829 {
    constructor() {
        this.name = 'Backend1694514918829';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP CONSTRAINT "FK_54f5a5b6364b9cca43d650883e0"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" RENAME COLUMN "user_id" TO "user"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP COLUMN "user"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD "user" character varying`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD CONSTRAINT "FK_5e59db131371ae557edfc20abad" FOREIGN KEY ("user") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP CONSTRAINT "FK_5e59db131371ae557edfc20abad"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP COLUMN "user"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD "user" uuid`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" RENAME COLUMN "user" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD CONSTRAINT "FK_54f5a5b6364b9cca43d650883e0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.Backend1694514918829 = Backend1694514918829;
//# sourceMappingURL=1694514918829-backend.js.map