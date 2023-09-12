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
exports.PrizeProposalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const prize_proposals_entity_1 = require("../entities/prize-proposals.entity");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const mail_service_1 = require("../../mail/mail.service");
const users_service_1 = require("../../users/users.service");
let PrizeProposalsService = class PrizeProposalsService {
    constructor(prizeProposalsRepository, configService, mailService, userService) {
        this.prizeProposalsRepository = prizeProposalsRepository;
        this.configService = configService;
        this.mailService = mailService;
        this.userService = userService;
    }
    async create(createPrizeDto, userId) {
        const user = await this.userService.findOneByUserId(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        await this.prizeProposalsRepository.save(Object.assign({}, createPrizeDto));
        await this.mailService.proposalSent(user.email);
    }
    async findAll() {
        return await this.prizeProposalsRepository.find();
    }
    async findByUserWithPagination(paginationOptions, userId) {
        return this.prizeProposalsRepository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: {
                user: {
                    user_id: userId,
                },
            },
        });
    }
    async findByUser(userId) {
        return await this.prizeProposalsRepository.findBy({
            user: {
                user_id: userId,
            },
        });
    }
    async findOne(id) {
        return await this.prizeProposalsRepository.findOne({
            where: {
                id,
            },
        });
    }
    async approve(id) {
        const prizeProposal = await this.findOne(id);
        if (!(prizeProposal === null || prizeProposal === void 0 ? void 0 : prizeProposal.user)) {
            throw new Error('User not found');
        }
        await this.prizeProposalsRepository.update(id, {
            isApproved: true,
        });
        await this.mailService.approved(prizeProposal.user.email);
    }
    async update(id, updatePrizeDto) {
        await this.prizeProposalsRepository.update(id, updatePrizeDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.prizeProposalsRepository.delete(id);
    }
};
exports.PrizeProposalsService = PrizeProposalsService;
exports.PrizeProposalsService = PrizeProposalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prize_proposals_entity_1.PrizeProposals)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService,
        mail_service_1.MailService,
        users_service_1.UsersService])
], PrizeProposalsService);
//# sourceMappingURL=prizes-proposals.service.js.map