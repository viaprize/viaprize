import { Module } from '@nestjs/common';
import { PrizesService } from './prizes.service';
import { PrizesController } from './prizes.controller';
import { PrizeProposalsService } from './services/prizes-proposals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrizeProposals } from './entities/prize-proposals.entity';

@Module({
  controllers: [PrizesController],
  imports: [TypeOrmModule.forFeature([PrizeProposals])],
  providers: [PrizesService, PrizeProposalsService],
})
export class PrizesModule {}
