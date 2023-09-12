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
exports.PrizeProposals = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let PrizeProposals = class PrizeProposals {
};
exports.PrizeProposals = PrizeProposals;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PrizeProposals.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PrizeProposals.prototype, "platform_reward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], PrizeProposals.prototype, "distributed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PrizeProposals.prototype, "voting_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PrizeProposals.prototype, "submission_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array', items: { type: 'string' } }),
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], PrizeProposals.prototype, "admins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], PrizeProposals.prototype, "isApproved", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], PrizeProposals.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], PrizeProposals.prototype, "isAutomatic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], PrizeProposals.prototype, "startVotingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], PrizeProposals.prototype, "startSubmissionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array', items: { type: 'string' } }),
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], PrizeProposals.prototype, "proficiencies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array', items: { type: 'string' } }),
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], PrizeProposals.prototype, "priorities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array', items: { type: 'string' } }),
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], PrizeProposals.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string' }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.prizeProposals),
    __metadata("design:type", user_entity_1.User)
], PrizeProposals.prototype, "user", void 0);
exports.PrizeProposals = PrizeProposals = __decorate([
    (0, typeorm_1.Entity)()
], PrizeProposals);
//# sourceMappingURL=prize-proposals.entity.js.map