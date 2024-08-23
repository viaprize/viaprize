import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateExtraPrizeDto } from '../dto/create-extra-prize.dto';
import { ExtraPrize } from '../entities/extra-prize.entity';

@Injectable()
export class ExtraPrizeDataService {
  constructor(
    @InjectRepository(ExtraPrize)
    private prizeRepository: Repository<ExtraPrize>,
  ) {}

  async getFundByExternalId(externalId: string): Promise<ExtraPrize> {
    const prizeData = await this.prizeRepository.findOne({
      where: {
        externalId: externalId,
      },
    });
    return (
      prizeData ??
      ({
        id: '',
        externalId: externalId,
        fundsInBtc: 0,
        fundsInEth: 0,
        fundsInSol: 0,
        fundsUsd: 0,
      } as ExtraPrize)
    );
  }

  async updateFund(prize: UpdateExtraPrizeDto): Promise<ExtraPrize> {
    const oldPrize = await this.getFundByExternalId(prize.externalId);
    const newPrize = await this.getFundByExternalId(prize.externalId);
    await this.prizeRepository.update(oldPrize.id, {
      fundsInBtc: oldPrize.fundsInBtc + (prize.fundsInBtc ?? 0),
      fundsInEth: oldPrize.fundsInEth + (prize.fundsInEth ?? 0),
      fundsInSol: oldPrize.fundsInSol + (prize.fundsInSol ?? 0),
      fundsUsd: oldPrize.fundsUsd + (prize.fundsUsd ?? 0),
    });
    return newPrize;
  }
}
