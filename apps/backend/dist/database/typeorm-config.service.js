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
exports.TypeOrmConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TypeOrmConfigService = class TypeOrmConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    createTypeOrmOptions() {
        var _a, _b, _c;
        return {
            type: this.configService.get('database.type', { infer: true }),
            url: this.configService.get('database.url', { infer: true }),
            host: this.configService.get('database.host', { infer: true }),
            port: this.configService.get('database.port', { infer: true }),
            username: this.configService.get('database.username', { infer: true }),
            password: this.configService.get('database.password', { infer: true }),
            database: this.configService.get('database.name', { infer: true }),
            synchronize: this.configService.get('database.synchronize', {
                infer: true,
            }),
            dropSchema: false,
            keepConnectionAlive: true,
            logging: this.configService.get('app.nodeEnv', { infer: true }) !== 'production',
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
            cli: {
                entitiesDir: 'src',
                migrationsDir: 'src/database/migrations',
                subscribersDir: 'subscriber',
            },
            extra: {
                max: this.configService.get('database.maxConnections', { infer: true }),
                ssl: this.configService.get('database.sslEnabled', { infer: true })
                    ? {
                        rejectUnauthorized: this.configService.get('database.rejectUnauthorized', { infer: true }),
                        ca: (_a = this.configService.get('database.ca', { infer: true })) !== null && _a !== void 0 ? _a : undefined,
                        key: (_b = this.configService.get('database.key', { infer: true })) !== null && _b !== void 0 ? _b : undefined,
                        cert: (_c = this.configService.get('database.cert', { infer: true })) !== null && _c !== void 0 ? _c : undefined,
                    }
                    : undefined,
            },
        };
    }
};
exports.TypeOrmConfigService = TypeOrmConfigService;
exports.TypeOrmConfigService = TypeOrmConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TypeOrmConfigService);
//# sourceMappingURL=typeorm-config.service.js.map