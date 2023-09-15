"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backend1694509877969 = void 0;
class Backend1694509877969 {
    constructor() {
        this.name = 'Backend1694509877969';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAdmin"`);
    }
}
exports.Backend1694509877969 = Backend1694509877969;
//# sourceMappingURL=1694509877969-backend.js.map