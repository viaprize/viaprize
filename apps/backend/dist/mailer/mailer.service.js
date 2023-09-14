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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = __importDefault(require("node:fs/promises"));
const config_1 = require("@nestjs/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlebars_1 = __importDefault(require("handlebars"));
let MailerService = class MailerService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer_1.default.createTransport({
            host: configService.get('mail.host', { infer: true }),
            port: configService.get('mail.port', { infer: true }),
            auth: {
                user: configService.get('mail.user', { infer: true }),
                pass: configService.get('mail.password', { infer: true }),
            },
        });
    }
    async sendMail(_a) {
        var { templatePath, context } = _a, mailOptions = __rest(_a, ["templatePath", "context"]);
        let html;
        if (templatePath) {
            const template = await promises_1.default.readFile(templatePath, 'utf-8');
            html = handlebars_1.default.compile(template, {
                strict: true,
            })(context);
        }
        await this.transporter.sendMail(Object.assign(Object.assign({}, mailOptions), { from: mailOptions.from
                ? mailOptions.from
                : `"${this.configService.get('mail.user', {
                    infer: true,
                })}"`, html: mailOptions.html ? mailOptions.html : html }));
    }
    async sendSimpleMail(options) {
        await this.transporter.sendMail(Object.assign(Object.assign({}, options), { from: 'noahcremean@gmail.com' }));
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailerService);
//# sourceMappingURL=mailer.service.js.map