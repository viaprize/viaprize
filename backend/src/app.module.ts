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
import { PrizesModule } from './prizes/prizes.module';
import { UsersModule } from './users/users.module';
// import { EthersModule } from 'nestjs-ethers';
import { CacheModule } from '@nestjs/cache-manager';
import { BlockchainModule } from './blockchain/blockchain.module';
import { IndexerModule } from './indexer/indexer.module';
import { PortalsModule } from './portals/portals.module';
import { PriceController } from './price/price.controller';
import { WalletModule } from './wallet/wallet.module';

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
    CacheModule.register(),
    PrizesModule,
    UsersModule,
    MailModule,
    MailerModule,
    JobsModule,
    BlockchainModule,
    PortalsModule,
    IndexerModule,
    WalletModule,
  ],
  providers: [],
  controllers: [PriceController],
})
export class AppModule {}
