"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrizesModule = void 0;
const common_1 = require("@nestjs/common");
const prizes_service_1 = require("./prizes.service");
const prizes_controller_1 = require("./prizes.controller");
const prizes_proposals_service_1 = require("./services/prizes-proposals.service");
const typeorm_1 = require("@nestjs/typeorm");
const prize_proposals_entity_1 = require("./entities/prize-proposals.entity");
const prize_entity_1 = require("./entities/prize.entity");
const users_module_1 = require("../users/users.module");
const mail_module_1 = require("../mail/mail.module");
const submission_entity_1 = require("./entities/submission.entity");
const prize_contract_1 = require("./contracts/prize.contract");
const blockchain_module_1 = require("../blockchain/blockchain.module");
let PrizesModule = class PrizesModule {
};
exports.PrizesModule = PrizesModule;
exports.PrizesModule = PrizesModule = __decorate([
    (0, common_1.Module)({
        controllers: [prizes_controller_1.PrizesController],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([prize_proposals_entity_1.PrizeProposals, prize_entity_1.Prize, submission_entity_1.Submission]),
            users_module_1.UsersModule,
            mail_module_1.MailModule,
            blockchain_module_1.BlockchainModule,
        ],
        providers: [prizes_service_1.PrizesService, prizes_proposals_service_1.PrizeProposalsService, prize_contract_1.PrizeContract],
    })
], PrizesModule);
//# sourceMappingURL=prizes.module.js.map