"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prize = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_2 = require("typeorm");
const submission_entity_1 = require("./submission.entity");
let Prize = class Prize {
};
exports.Prize = Prize;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Prize.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Prize.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Prize.prototype, "isAutomatic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Prize.prototype, "startVotingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Prize.prototype, "startSubmissionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Prize.prototype, "proposer_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Prize.prototype, "contract_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', items: { type: 'string' } }),
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], Prize.prototype, "admins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array', items: { type: 'string' } }),
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], Prize.prototype, "proficiencies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array', items: { type: 'string' } }),
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], Prize.prototype, "priorities", void 0);
__decorate([
    (0, typeorm_2.CreateDateColumn)(),
    __metadata("design:type", Date)
], Prize.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_2.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Prize.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => submission_entity_1.Submission, (submission) => submission.prize),
    __metadata("design:type", Array)
], Prize.prototype, "submissions", void 0);
exports.Prize = Prize = __decorate([
    (0, typeorm_1.Entity)()
], Prize);
//# sourceMappingURL=prize.entity.js.map