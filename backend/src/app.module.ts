import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

import { AgendaModule } from 'agenda-nest';
import { AgendaModuleConfig } from 'agenda-nest/dist/interfaces';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';

import { MailModule } from 'src/mail/mail.module';
import { MailerModule } from 'src/mailer/mailer.module';
import mailConfig from './config/mail.config';
import { JobsModule } from './jobs/jobs.module';
import { PactsModule } from './pacts/pacts.module';
import { PrizesModule } from './prizes/prizes.module';
import { UsersModule } from './users/users.module';
// import { EthersModule } from 'nestjs-ethers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, mailConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    AgendaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) =>
        ({
          db: {
            address: config.get<string>('SCHEDULE_DATABASE_URL'),
          },
        }) as AgendaModuleConfig,
      inject: [ConfigService],
    }),
    PactsModule,
    PrizesModule,
    UsersModule,
    MailModule,
    MailerModule,
    JobsModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}