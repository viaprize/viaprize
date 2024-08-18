import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExtraPrizeDto } from '../dto/create-extra-prize.dto';
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

  async createFund(prize: CreateExtraPrizeDto): Promise<ExtraPrize> {
    const prizeObject = this.prizeRepository.create({
      externalId: prize.externalId,
      fundsInBtc: prize.fundsInBtc,
      fundsInEth: prize.fundsInEth,
      fundsInSol: prize.fundsInSol,
      fundsUsd: prize.fundsUsd,
    });
    return await this.prizeRepository.save(prizeObject);
  }
}
