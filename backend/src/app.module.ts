import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

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
import { BlockchainModule } from './blockchain/blockchain.module';
import { IndexerModule } from './indexer/indexer.module';
import { PortalsModule } from './portals/portals.module';

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
    CacheModule.register(
      {
        isGlobal: true
      }
    ),
    // TriggerDevModule.registerAsync({
    //   useFactory: (configService: ConfigService) => {
    //     console.log(configService.get<string>("TRIGGER_API_KEY"), "hiiiiiiiiiiiiiiiiiiiiiii")
    //     return ({
    //       id: 'viaprize-prod',
    //       apiKey: configService.get<string>("TRIGGER_API_KEY"),
    //       apiUrl: "https://cloud.trigger.dev",

    //     })
    //   },
    //   inject: [ConfigService],
    // }),
    // AgendaModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (config: ConfigService) =>
    //     ({
    //       db: {
    //         address: config.get<string>('SCHEDULE_DATABASE_URL'),
    //       },
    //     }) as AgendaModuleConfig,
    //   inject: [ConfigService],
    // }),
    PactsModule,
    PrizesModule,
    UsersModule,
    MailModule,
    MailerModule,
    JobsModule,
    BlockchainModule,
    PortalsModule,
    IndexerModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule { }
