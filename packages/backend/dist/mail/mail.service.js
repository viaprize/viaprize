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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mailer_service_1 = require("../mailer/mailer.service");
let MailService = class MailService {
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
    }
    welcome(email) {
        this.mailerService.sendSimpleMail({
            to: email,
            subject: 'Welcome to the app',
            text: 'Welcome to the app',
        });
    }
    async test() {
        await this.mailerService.sendSimpleMail({
            to: 'dipanshuhappy@gmail.com',
            subject: 'Hi',
            text: 'testing',
        });
    }
    async approved(to) {
        await this.mailerService.sendSimpleMail({
            to,
            subject: 'Hi your proposal is approved',
            text: 'Hi your proposal is approved',
        });
    }
    async rejected(to, comment) {
        await this.mailerService.sendSimpleMail({
            to,
            subject: `Hi your proposal was rejected `,
            text: `${comment} \n This is why your proposal was rejected`,
        });
    }
    async proposalSent(to) {
        await this.mailerService.sendSimpleMail({
            to,
            subject: 'Hi your proposal is sent',
            text: 'Hi your proposal is sent , you will be notified once approved or rejected',
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