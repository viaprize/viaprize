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
const validate_config_1 = __importDefault(require("../utils/validate-config"));
const class_validator_1 = require("class-validator");
var Environment;
(function (Environment) {
    Environment["Development"] = "development";
    Environment["Production"] = "production";
    Environment["Test"] = "test";
})(Environment || (Environment = {}));
class EnvironmentVariablesValidator {
}
__decorate([
    (0, class_validator_1.IsEnum)(Environment),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "NODE_ENV", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(65535),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "APP_PORT", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "FRONTEND_DOMAIN", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "BACKEND_DOMAIN", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "API_PREFIX", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "APP_FALLBACK_LANGUAGE", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "APP_HEADER_LANGUAGE", void 0);
exports.default = (0, config_1.registerAs)('app', () => {
    var _a;
    (0, validate_config_1.default)(process.env, EnvironmentVariablesValidator);
    return {
        nodeEnv: process.env.NODE_ENV || 'development',
        name: process.env.APP_NAME || 'app',
        workingDirectory: process.env.PWD || process.cwd(),
        frontendDomain: process.env.FRONTEND_DOMAIN,
        backendDomain: (_a = process.env.BACKEND_DOMAIN) !== null && _a !== void 0 ? _a : 'http://localhost',
        port: process.env.APP_PORT
            ? parseInt(process.env.APP_PORT, 10)
            : process.env.PORT
                ? parseInt(process.env.PORT, 10)
                : 3000,
        apiPrefix: process.env.API_PREFIX || 'api',
        fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
        headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
        platformSharePercentage: parseInt(process.env.PLATFORM_SHARE_PERCENTAGE || '5'),
        scheduleDatabaseUrL: process.env.SCHEDULE_DATABASE_URL || 'default',
        alchemy: process.env.ALCHEMY || 'no-api',
    };
});
//# sourceMappingURL=app.config.js.map