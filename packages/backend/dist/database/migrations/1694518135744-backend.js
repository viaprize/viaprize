"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backend1694518135744 = void 0;
class Backend1694518135744 {
    constructor() {
        this.name = 'Backend1694518135744';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "prize_proposals" ADD "title" character varying NOT NULL DEFAULT ''`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "prize_proposals" DROP COLUMN "title"`);
    }
}
exports.Backend1694518135744 = Backend1694518135744;
//# sourceMappingURL=1694518135744-backend.js.map