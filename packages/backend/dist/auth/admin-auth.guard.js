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
exports.AdminAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const server_auth_1 = require("@privy-io/server-auth");
const config_1 = require("@nestjs/config");
const handlebars_1 = require("handlebars");
const users_service_1 = require("../users/users.service");
let AdminAuthGuard = class AdminAuthGuard {
    constructor(configService, userService) {
        this.configService = configService;
        this.userService = userService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException();
        }
        const appId = this.configService.getOrThrow('PRIVY_APP_ID');
        const appSecret = this.configService.getOrThrow('PRIVY_APP_SECRET');
        const privy = new server_auth_1.PrivyClient(appId, appSecret);
        let verifiedClaims = null;
        try {
            verifiedClaims = await privy.verifyAuthToken(token);
        }
        catch (error) {
            console.log(`Token verification failed with error ${error}.`);
        }
        if (!verifiedClaims) {
            throw new common_1.HttpException('Token verification failed', common_1.HttpStatus.CONFLICT);
        }
        const admin = await this.userService.findOneByUserId(verifiedClaims.userId);
        if (!admin.isAdmin) {
            throw new common_1.HttpException('Only Admins can call this route ', common_1.HttpStatus.CONFLICT);
        }
        request.user = verifiedClaims;
        return true;
    }
    extractTokenFromHeader(request) {
        var _a, _b;
        console.log(request.headers, 'header');
        if (!((_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.authorization)) {
            throw new common_1.HttpException('No authorization header found', common_1.HttpStatus.FORBIDDEN);
        }
        const authToken = (_b = request === null || request === void 0 ? void 0 : request.headers) === null || _b === void 0 ? void 0 : _b.authorization.replace('Bearer ', '');
        if (!authToken) {
            throw new handlebars_1.Exception('No auth token found');
        }
        return authToken;
    }
};
exports.AdminAuthGuard = AdminAuthGuard;
exports.AdminAuthGuard = AdminAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], AdminAuthGuard);
//# sourceMappingURL=admin-auth.guard.js.map