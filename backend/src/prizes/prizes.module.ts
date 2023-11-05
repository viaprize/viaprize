import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { PrizeProposals } from './entities/prize-proposals.entity';
import { Prize } from './entities/prize.entity';
import { Submission } from './entities/submission.entity';
import { PrizesController } from './prizes.controller';
import { PrizesService } from './prizes.service';
import { PrizeProposalsService } from './services/prizes-proposals.service';

@Module({
  controllers: [PrizesController],
  imports: [
    TypeOrmModule.forFeature([PrizeProposals, Prize, Submission]),
    UsersModule,
    MailModule,
    BlockchainModule,
  ],
  providers: [PrizesService, PrizeProposalsService],
})
export class PrizesModule {}
