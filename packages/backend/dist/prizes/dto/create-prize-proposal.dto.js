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
exports.CreatePrizeProposalDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePrizeProposalDto {
}
exports.CreatePrizeProposalDto = CreatePrizeProposalDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'The number of seconds for the voting period.',
        example: 604800,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePrizeProposalDto.prototype, "voting_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'The number of seconds for the submission period.',
        example: 86400,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePrizeProposalDto.prototype, "submission_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        description: 'The list of admins for the proposal.',
        example: ['admin1', 'admin2'],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePrizeProposalDto.prototype, "admins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'TItle of the proposal',
        example: 'Hackzuzalu',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrizeProposalDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'The description of the proposal.',
        example: 'This is a proposal for a new prize.',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrizeProposalDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'The address of the proposer.',
        example: '0x1234567890abcdef',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrizeProposalDto.prototype, "proposer_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Whether the proposal is automatic or not.',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePrizeProposalDto.prototype, "isAutomatic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Date,
        description: 'The start date of the voting period.',
        example: '2023-09-10T17:20:50.756Z',
        nullable: true,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreatePrizeProposalDto.prototype, "startVotingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Date,
        description: 'The start date of the submission period.',
        example: '2023-09-10T17:20:50.756Z',
        nullable: true,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreatePrizeProposalDto.prototype, "startSubmissionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['Programming'] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePrizeProposalDto.prototype, "proficiencies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['Climate change'] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePrizeProposalDto.prototype, "priorities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: [
            'https://ipfs.io/ipfs/QmZ1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0',
        ],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePrizeProposalDto.prototype, "images", void 0);
//# sourceMappingURL=create-prize-proposal.dto.js.map