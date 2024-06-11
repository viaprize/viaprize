import { CacheModule } from '@nestjs/cache-manager';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { PrizeProposals } from './entities/prize-proposals.entity';
import { Prize } from './entities/prize.entity';
import { PrizesComments } from './entities/prizes-comments.entity';
import { Submission } from './entities/submission.entity';
import { PrizesController } from './prizes.controller';
import { PrizeCommentService } from './services/prize-comment.service';
import { PrizeProposalsService } from './services/prizes-proposals.service';
import { PrizesService } from './services/prizes.service';
import { SubmissionService } from './services/submissions.service';

@Module({
  controllers: [PrizesController],
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([
      PrizeProposals,
      Prize,
      Submission,
      PrizesComments,
    ]),
    UsersModule,
    MailModule,
    BlockchainModule,
    forwardRef(() => WalletModule),
  ],
  exports: [PrizesService],
  providers: [
    PrizesService,
    SubmissionService,
    PrizeProposalsService,
    PrizeCommentService,
  ],
})
export class PrizesModule {}
