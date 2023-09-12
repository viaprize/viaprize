"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const validationOptions = {
    transform: true,
    whitelist: true,
    errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
    exceptionFactory: (errors) => new common_1.HttpException({
        status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        errors: errors.reduce((accumulator, currentValue) => {
            var _a;
            return (Object.assign(Object.assign({}, accumulator), { [currentValue.property]: Object.values((_a = currentValue.constraints) !== null && _a !== void 0 ? _a : {}).join(', ') }));
        }, {}),
    }, common_1.HttpStatus.UNPROCESSABLE_ENTITY),
};
exports.default = validationOptions;
//# sourceMappingURL=validation-options.js.map