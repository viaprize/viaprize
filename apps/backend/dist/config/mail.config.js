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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const class_validator_1 = require("class-validator");
const validate_config_1 = __importDefault(require("../utils/validate-config"));
class EnvironmentVariablesValidator {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(65535),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "MAIL_PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "MAIL_HOST", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "MAIL_USER", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "MAIL_PASSWORD", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "MAIL_DEFAULT_EMAIL", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "MAIL_DEFAULT_NAME", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "MAIL_IGNORE_TLS", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "MAIL_SECURE", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "MAIL_REQUIRE_TLS", void 0);
exports.default = (0, config_1.registerAs)('mail', () => {
    (0, validate_config_1.default)(process.env, EnvironmentVariablesValidator);
    return {
        port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
        host: process.env.MAIL_HOST,
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
        defaultName: process.env.MAIL_DEFAULT_NAME,
        ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
        secure: process.env.MAIL_SECURE === 'true',
        requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
    };
});
//# sourceMappingURL=mail.config.js.map