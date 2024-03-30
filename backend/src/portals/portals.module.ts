import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { PortalProposals } from './entities/portal-proposals.entity';
import { Portals } from './entities/portal.entity';
import { PortalsComments } from './entities/portals-comments.entity';
import { PortalsController } from './portals.controller';
import { ExtraPortalDataService } from './services/extra-portal-data.service';
import { PortalCommentService } from './services/portal-comments.service';
import { PortalProposalsService } from './services/portal-proposals.service';
import { PortalsService } from './services/portals.service';

@Module({
  controllers: [PortalsController],
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([Portals, PortalProposals, PortalsComments]),
    UsersModule,
    MailModule,
    BlockchainModule,
    JobsModule,
  ],
  providers: [PortalsService, PortalProposalsService, PortalCommentService,ExtraPortalDataService],
})
export class PortalsModule {}
