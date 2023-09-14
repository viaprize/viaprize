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
exports.PrizesService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_paginate_1 = require("nestjs-paginate");
const prize_entity_1 = require("./entities/prize.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mail_service_1 = require("../mail/mail.service");
const prize_contract_1 = require("./contracts/prize.contract");
let PrizesService = class PrizesService {
    constructor(prizeRepository, mailService, prizeContract) {
        this.prizeRepository = prizeRepository;
        this.mailService = mailService;
        this.prizeContract = prizeContract;
    }
    create(createPrizeDto) {
        return 'This action adds a new prize';
    }
    async findAll(query) {
        let paginations;
        const total_funds = query.search['total_funds'];
        paginations = await (0, nestjs_paginate_1.paginate)(query, this.prizeRepository, {
            sortableColumns: ['created_at'],
            defaultSortBy: ['created_at'],
            filterableColumns: {
                proficiencies: [nestjs_paginate_1.FilterOperator.IN],
                priorities: [nestjs_paginate_1.FilterOperator.IN],
            },
        });
        if (total_funds) {
            paginations = {
                links: paginations.links,
                meta: paginations.meta,
                data: Object.assign({}, paginations.data),
            };
        }
        return paginations;
    }
    async getSmartContractDetails() {
        const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        const admins = await this.prizeContract.getAdmins(contractAddress);
        const funders = await this.prizeContract.getFunders(contractAddress);
        return {
            admins,
            funders,
        };
    }
    async findOne(id) {
        return await this.prizeRepository.findOne({
            where: {
                id,
            },
        });
    }
    update(id, updatePrizeDto) {
        return `This action updates a #${id} prize`;
    }
    async addSummission(id, createSubmissionDto) { }
    remove(id) {
        return `This action removes a #${id} prize`;
    }
};
exports.PrizesService = PrizesService;
exports.PrizesService = PrizesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prize_entity_1.Prize)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService,
        prize_contract_1.PrizeContract])
], PrizesService);
//# sourceMappingURL=prizes.service.js.map