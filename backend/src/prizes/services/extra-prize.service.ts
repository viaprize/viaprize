import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateExtraPrizeDto } from '../dto/update-extra-prize.dto';
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

  async updateFund(
    prize: UpdateExtraPrizeDto,
    externalId: string,
  ): Promise<ExtraPrize> {
    const oldPrize = await this.getFundByExternalId(externalId);

    await this.prizeRepository.update(oldPrize.id, {
      fundsInBtc:
        parseFloat(oldPrize.fundsInBtc.toString()) +
        parseFloat(prize.fundsInBtc ?? '0'),
      fundsInEth:
        parseFloat(oldPrize.fundsInEth.toString()) +
        parseFloat(prize.fundsInEth ?? '0'),
      fundsInSol:
        parseFloat(oldPrize.fundsInSol.toString()) +
        parseFloat(prize.fundsInSol ?? '0'),
      fundsUsd:
        parseFloat(oldPrize.fundsUsd.toString()) +
        parseFloat(prize.fundsUsd ?? '0'),
    });
    const newPrize = await this.getFundByExternalId(prize.externalId);
    return newPrize;
  }
}
