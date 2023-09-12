"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const database_config_1 = __importDefault(require("./config/database.config"));
const app_config_1 = __importDefault(require("./config/app.config"));
const path_1 = __importDefault(require("path"));
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const i18n_module_1 = require("nestjs-i18n/dist/i18n.module");
const nestjs_i18n_1 = require("nestjs-i18n");
const typeorm_config_service_1 = require("./database/typeorm-config.service");
const typeorm_2 = require("typeorm");
const agenda_nest_1 = require("agenda-nest");
const pacts_module_1 = require("./pacts/pacts.module");
const prizes_module_1 = require("./prizes/prizes.module");
const users_module_1 = require("./users/users.module");
const mail_module_1 = require("./mail/mail.module");
const mailer_module_1 = require("./mailer/mailer.module");
const jobs_module_1 = require("./jobs/jobs.module");
const mail_config_1 = __importDefault(require("./config/mail.config"));
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default, app_config_1.default, mail_config_1.default],
                envFilePath: ['.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useClass: typeorm_config_service_1.TypeOrmConfigService,
                dataSourceFactory: async (options) => {
                    return new typeorm_2.DataSource(options).initialize();
                },
            }),
            agenda_nest_1.AgendaModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    db: {
                        address: config.get('SCHEDULE_DATABASE_URL'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            i18n_module_1.I18nModule.forRootAsync({
                useFactory: (configService) => ({
                    fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
                        infer: true,
                    }),
                    loaderOptions: { path: path_1.default.join(__dirname, '/i18n/'), watch: true },
                }),
                resolvers: [
                    {
                        use: nestjs_i18n_1.HeaderResolver,
                        useFactory: (configService) => {
                            return [
                                configService.get('app.headerLanguage', {
                                    infer: true,
                                }),
                            ];
                        },
                        inject: [config_1.ConfigService],
                    },
                ],
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
            }),
            pacts_module_1.PactsModule,
            prizes_module_1.PrizesModule,
            users_module_1.UsersModule,
            mail_module_1.MailModule,
            mailer_module_1.MailerModule,
            jobs_module_1.JobsModule,
            auth_module_1.AuthModule,
        ],
        providers: [],
        controllers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map