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
exports.PactEntity = void 0;
const typeorm_1 = require("typeorm");
let PactEntity = class PactEntity {
};
exports.PactEntity = PactEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", Number)
], PactEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PactEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], PactEntity.prototype, "terms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 42 }),
    __metadata("design:type", String)
], PactEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 66 }),
    __metadata("design:type", String)
], PactEntity.prototype, "transactionHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 66, nullable: true }),
    __metadata("design:type", String)
], PactEntity.prototype, "blockHash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['testnet', 'mainnet'],
        nullable: true,
    }),
    __metadata("design:type", String)
], PactEntity.prototype, "networkType", void 0);
exports.PactEntity = PactEntity = __decorate([
    (0, typeorm_1.Entity)('pacts'),
    (0, typeorm_1.Unique)(['address', 'transactionHash'])
], PactEntity);
//# sourceMappingURL=pact.entity.js.map