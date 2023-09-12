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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrizesController = void 0;
const common_1 = require("@nestjs/common");
const prizes_proposals_service_1 = require("./services/prizes-proposals.service");
const create_prize_proposal_dto_1 = require("./dto/create-prize-proposal.dto");
const swagger_1 = require("@nestjs/swagger");
const prize_proposals_entity_1 = require("./entities/prize-proposals.entity");
const infinity_pagination_1 = require("../utils/infinity-pagination");
const swagger_2 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth.guard");
class PrizeProposalsPaginationResult {
}
__decorate([
    (0, swagger_2.ApiProperty)({ type: [prize_proposals_entity_1.PrizeProposals] }),
    __metadata("design:type", Array)
], PrizeProposalsPaginationResult.prototype, "results", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], PrizeProposalsPaginationResult.prototype, "total", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], PrizeProposalsPaginationResult.prototype, "page", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], PrizeProposalsPaginationResult.prototype, "limit", void 0);
let PrizesController = class PrizesController {
    constructor(prizeProposalsService) {
        this.prizeProposalsService = prizeProposalsService;
    }
    create(createPrizeProposalDto, req) {
        console.log({ createPrizeProposalDto });
        console.log(req.user, 'user');
        return this.prizeProposalsService.create(createPrizeProposalDto, req.user.userId);
    }
    async getProposalsBy(page, limit, userId) {
        if (limit > 50) {
            limit = 50;
        }
        return (0, infinity_pagination_1.infinityPagination)(await this.prizeProposalsService.findByUserWithPagination({
            limit,
            page,
        }, userId), { page, limit });
    }
    async getProposal(id) {
        return await this.prizeProposalsService.findOne(id);
    }
    async approveProposal(id) {
        return await this.prizeProposalsService.approve(id);
    }
};
exports.PrizesController = PrizesController;
__decorate([
    (0, common_1.Post)('/proposals'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Proposal of a Prize  by passing Prize data ',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Request body to create a prize',
        type: create_prize_proposal_dto_1.CreatePrizeProposalDto,
    }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_prize_proposal_dto_1.CreatePrizeProposalDto, Object]),
    __metadata("design:returntype", void 0)
], PrizesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/proposals/user/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The proposals were returned successfully',
        type: PrizeProposalsPaginationResult,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        example: 1,
        type: Number,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        example: 10,
        type: Number,
    }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        type: String,
    }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PrizesController.prototype, "getProposalsBy", null);
__decorate([
    (0, common_1.Get)('/proposals/:id'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The proposals were returned successfully',
        type: PrizeProposalsPaginationResult,
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrizesController.prototype, "getProposal", null);
__decorate([
    (0, common_1.Post)('/proposals/accept/:id'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The Proposals was Approved',
    }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrizesController.prototype, "approveProposal", null);
exports.PrizesController = PrizesController = __decorate([
    (0, swagger_1.ApiTags)('prizes'),
    (0, common_1.Controller)('prizes'),
    __metadata("design:paramtypes", [prizes_proposals_service_1.PrizeProposalsService])
], PrizesController);
//# sourceMappingURL=prizes.controller.js.map