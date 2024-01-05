import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { PortalProposals } from './entities/portal-proposals.entity';
import { Portals } from './entities/portal.entity';
import { PortalsController } from './portals.controller';
import { PortalProposalsService } from './services/portal-proposals.service';
import { PortalsService } from './services/portals.service';

@Module({
  controllers: [PortalsController],
  imports: [
    TypeOrmModule.forFeature([Portals, PortalProposals]),
    UsersModule,
    MailModule,
    BlockchainModule,
    JobsModule,
  ],
  providers: [PortalsService, PortalProposalsService],
})
export class PortalsModule { }
