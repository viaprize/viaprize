"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const app_module_1 = require("./app.module");
const validation_options_1 = __importDefault(require("./utils/validation-options"));
const platform_fastify_1 = require("@nestjs/platform-fastify");
const path_1 = require("path");
async function bootstrap() {
    const adapter = new platform_fastify_1.FastifyAdapter({
        logger: true,
    });
    adapter.useStaticAssets({
        root: (0, path_1.join)(__dirname, '..', 'public'),
        prefix: '/public/',
    });
    adapter.enableCors({
        origin: '*',
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, adapter);
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    const configService = app.get((config_1.ConfigService));
    app.enableShutdownHooks();
    app.setGlobalPrefix(configService.getOrThrow('app.apiPrefix', { infer: true }), {
        exclude: ['/'],
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    app.useGlobalPipes(new common_1.ValidationPipe(validation_options_1.default));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    const options = new swagger_1.DocumentBuilder()
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    }, 'access-token')
        .setTitle('API')
        .setDescription('API docs')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
//# sourceMappingURL=main.js.map