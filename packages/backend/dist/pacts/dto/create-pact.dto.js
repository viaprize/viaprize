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
exports.CreatePactDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePactDto {
}
exports.CreatePactDto = CreatePactDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the pact i.e the Title',
        type: String,
        example: 'Test',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], CreatePactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Terms of the pact i.e the Description',
        type: String,
        example: 'Test',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePactDto.prototype, "terms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address of the pact on the blockchain',
        type: String,
        example: '0xe7399b79838acc8caaa567fF84e5EFd0d11BB010',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(42, 42),
    __metadata("design:type", String)
], CreatePactDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'transaction hash of the pact on the blockchain',
        type: String,
        example: '0x2e8937d96e633c82df2f8f5a19aafa132795496cd98d0ca3d3c336a6c79f09e4',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(66, 66),
    __metadata("design:type", String)
], CreatePactDto.prototype, "transactionHash", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(66, 66),
    __metadata("design:type", String)
], CreatePactDto.prototype, "blockHash", void 0);
//# sourceMappingURL=create-pact.dto.js.map