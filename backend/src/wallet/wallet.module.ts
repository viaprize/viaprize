import { Module, forwardRef } from '@nestjs/common';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { PrizesModule } from 'src/prizes/prizes.module';
import { UsersModule } from 'src/users/users.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  providers: [WalletService],
  exports: [WalletService],
  controllers: [WalletController],
  imports: [
    UsersModule,
    BlockchainModule,
    JobsModule,
    forwardRef(() => PrizesModule),
  ],
})
export class WalletModule {}
