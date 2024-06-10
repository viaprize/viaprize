import { Module } from '@nestjs/common';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { PrizesModule } from 'src/prizes/prizes.module';
import { UsersModule } from 'src/users/users.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  providers: [WalletService],
  exports: [WalletService],
  controllers: [WalletController],
  imports: [UsersModule, BlockchainModule, PrizesModule],
})
export class WalletModule {}
