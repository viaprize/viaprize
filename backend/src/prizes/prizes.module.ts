import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { PrizeProposals } from './entities/prize-proposals.entity';
import { Prize } from './entities/prize.entity';
import { Submission } from './entities/submission.entity';
import { PrizesController } from './prizes.controller';
import { PrizeProposalsService } from './services/prizes-proposals.service';
import { PrizesService } from './services/prizes.service';
import { SubmissionService } from './services/submissions.service';

@Module({
  controllers: [PrizesController],
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([PrizeProposals, Prize, Submission]),
    UsersModule,
    MailModule,
    BlockchainModule,
  ],
  providers: [PrizesService, SubmissionService, PrizeProposalsService],
})
export class PrizesModule { }
