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
    (0, class_validator_1.ValidateIf)((envValues) => envValues.DATABASE_URL),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_URL", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((envValues) => !envValues.DATABASE_URL),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_TYPE", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((envValues) => !envValues.DATABASE_URL),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_HOST", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((envValues) => !envValues.DATABASE_URL),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(65535),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "DATABASE_PORT", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((envValues) => !envValues.DATABASE_URL),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_PASSWORD", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((envValues) => !envValues.DATABASE_URL),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_NAME", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((envValues) => !envValues.DATABASE_URL),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_USERNAME", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "DATABASE_SYNCHRONIZE", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "DATABASE_MAX_CONNECTIONS", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "DATABASE_SSL_ENABLED", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "DATABASE_REJECT_UNAUTHORIZED", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_CA", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_KEY", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_CERT", void 0);
exports.default = (0, config_1.registerAs)('database', () => {
    (0, validate_config_1.default)(process.env, EnvironmentVariablesValidator);
    return {
        url: process.env.DATABASE_URL,
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT
            ? parseInt(process.env.DATABASE_PORT, 10)
            : 5432,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME,
        synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
        maxConnections: process.env.DATABASE_MAX_CONNECTIONS
            ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
            : 100,
        sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
        rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
        ca: process.env.DATABASE_CA,
        key: process.env.DATABASE_KEY,
        cert: process.env.DATABASE_CERT,
    };
});
//# sourceMappingURL=database.config.js.map