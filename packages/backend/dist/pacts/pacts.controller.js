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
exports.PactsController = void 0;
const common_1 = require("@nestjs/common");
const pacts_service_1 = require("./pacts.service");
const create_pact_dto_1 = require("./dto/create-pact.dto");
const swagger_1 = require("@nestjs/swagger");
let PactsController = class PactsController {
    constructor(pactsService) {
        this.pactsService = pactsService;
    }
    create(createPactDto, networkType) {
        return this.pactsService.create(createPactDto, networkType);
    }
    findAll(networkType) {
        return this.pactsService.findAll(networkType);
    }
    findOne(address) {
        return this.pactsService.findOne(address);
    }
};
exports.PactsController = PactsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create Pact by passing pact data and network type',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'Network-Type',
        description: 'Write if its testnet or mainnet',
        required: true,
        enum: ['testnet', 'mainnet'],
        example: 'testnet',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Request body to create pact',
        type: create_pact_dto_1.CreatePactDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('Network-Type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pact_dto_1.CreatePactDto, String]),
    __metadata("design:returntype", void 0)
], PactsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiHeader)({
        name: 'Network-Type',
        description: 'Write if its testnet or mainnet',
        required: true,
        enum: ['testnet', 'mainnet'],
        example: 'testnet',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pacts of a network type' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('Network-Type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PactsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':address'),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PactsController.prototype, "findOne", null);
exports.PactsController = PactsController = __decorate([
    (0, swagger_1.ApiTags)('pacts'),
    (0, common_1.Controller)('pacts'),
    __metadata("design:paramtypes", [pacts_service_1.PactsService])
], PactsController);
//# sourceMappingURL=pacts.controller.js.map