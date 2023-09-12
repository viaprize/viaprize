"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PactsModule = void 0;
const common_1 = require("@nestjs/common");
const pacts_service_1 = require("./pacts.service");
const pacts_controller_1 = require("./pacts.controller");
const typeorm_1 = require("@nestjs/typeorm");
const pact_entity_1 = require("./entities/pact.entity");
const mail_module_1 = require("../mail/mail.module");
let PactsModule = class PactsModule {
};
exports.PactsModule = PactsModule;
exports.PactsModule = PactsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pact_entity_1.PactEntity]), mail_module_1.MailModule],
        controllers: [pacts_controller_1.PactsController],
        providers: [pacts_service_1.PactsService],
        exports: [pacts_service_1.PactsService],
    })
], PactsModule);
//# sourceMappingURL=pacts.module.js.map