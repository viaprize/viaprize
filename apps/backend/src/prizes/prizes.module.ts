import { Module } from '@nestjs/common';
import { PrizesService } from './prizes.service';
import { PrizesController } from './prizes.controller';
import { PrizeProposalsService } from './services/prizes-proposals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrizeProposals } from './entities/prize-proposals.entity';
import { Prize } from './entities/prize.entity';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailModule } from 'src/mail/mail.module';
import { Submission } from './entities/submission.entity';
import { PrizeContract } from './contracts/prize.contract';
import { BlockchainModule } from 'src/blockchain/blockchain.module';

@Module({
  controllers: [PrizesController],
  imports: [
    TypeOrmModule.forFeature([PrizeProposals, Prize, Submission]),
    UsersModule,
    MailModule,
    BlockchainModule,
  ],
  providers: [PrizesService, PrizeProposalsService, PrizeContract],
})
export class PrizesModule {}
