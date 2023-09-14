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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mailer_service_1 = require("../mailer/mailer.service");
const path_1 = __importDefault(require("path"));
let MailService = class MailService {
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
    }
    async welcome(email, name) {
        const telegramLink = this.configService.getOrThrow('TELEGRAM_LINK', {
            infer: true,
        });
        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to the Viaprize',
            text: `Viaprize`,
            templatePath: path_1.default.join(__dirname, './templates/welcome.hbs'),
            context: {
                name,
                telegramLink,
            },
        });
    }
    async test() {
        await this.mailerService.sendSimpleMail({
            to: 'dipanshuhappy@gmail.com',
            subject: 'Hi',
            text: 'testing',
        });
    }
    async approved(to, name, proposalTitle, proposalDescription, proposalLink) {
        const telegramLink = this.configService.getOrThrow('TELEGRAM_LINK', {
            infer: true,
        });
        await this.mailerService.sendMail({
            to: to,
            subject: 'Hi your proposal was approved',
            text: `Viaprize `,
            templatePath: path_1.default.join(__dirname, '../../templates/approved.hbs'),
            context: {
                name,
                proposalTitle,
                proposalDescription,
                proposalLink,
                telegramLink,
            },
        });
    }
    async rejected(to, comment) {
    }
    async proposalSent(to, name, proposalTitle, proposalDescription, submissionDate) {
        const telegramLink = this.configService.getOrThrow('TELEGRAM_LINK', {
            infer: true,
        });
        await this.mailerService.sendMail({
            to: to,
            subject: 'Hi your proposal is sent',
            context: {
                name,
                proposalTitle,
                proposalDescription,
                submissionDate,
                telegramLink,
            },
            templatePath: path_1.default.join(__dirname, '../../templates/proposalSent.hbs'),
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_service_1.MailerService,
        config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map