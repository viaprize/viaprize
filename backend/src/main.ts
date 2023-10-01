import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import validationOptions from './utils/validation-options';

async function bootstrap() {
  const adapter = new FastifyAdapter({
    logger: true,
  });
  await adapter.useStaticAssets({
    root: join(__dirname, '..', 'public'), // Specify the directory where your static assets are located
    prefix: '/public/', // Spe
  });

  adapter.enableCors({
    origin: '*',
  });
  const app = await NestFactory.create(AppModule, adapter);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const docs = require('../../swagger.json');

  // const options = new DocumentBuilder().
  //   .addBearerAuth(
  //     {
  //       type: 'http',
  //       scheme: 'bearer',
  //       bearerFormat: 'JWT',
  //     },
  //     'access-token',
  //   )

  //   .setTitle('API')
  //   .setDescription('API docs')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build();

  // const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, docs);

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
