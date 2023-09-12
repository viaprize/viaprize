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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const mail_service_1 = require("../mail/mail.service");
let UsersService = class UsersService {
    constructor(userRepository, mailService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
    }
    async create(createUserDto) {
        try {
            const user = await this.userRepository.create(createUserDto);
            await this.userRepository.save(user);
            await this.mailService.welcome(user.email);
        }
        catch (error) {
            throw new common_1.HttpException('User Already Exists', common_1.HttpStatus.FORBIDDEN);
        }
    }
    findAll() {
        return `This action returns all users`;
    }
    findOneByUserId(userId) {
        return this.userRepository.findOne({
            where: {
                user_id: userId,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService])
], UsersService);
//# sourceMappingURL=users.service.js.map