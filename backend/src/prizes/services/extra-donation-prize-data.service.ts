import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExtraDonationPrizeDataDto } from '../dto/create-extra-donation.dto';
import { ExtraDonationPrizeData } from '../entities/extra-donation-prize-data.entity';

@Injectable()
export class ExtraDonationPrizeDataService {
  constructor(
    @InjectRepository(ExtraDonationPrizeData)
    private prizeRepository: Repository<ExtraDonationPrizeData>,
  ) {}

  async getDonationByExternalId(
    externalId: string,
  ): Promise<ExtraDonationPrizeData[]> {
    const prize = await this.prizeRepository.find({
      where: {
        externalId: externalId,
      },
    });
    return prize;
  }

  async createDonation(
    prizeDto: CreateExtraDonationPrizeDataDto,
  ): Promise<ExtraDonationPrizeData> {
    const prize = this.prizeRepository.create(prizeDto);

    return await this.prizeRepository.save(prize);
  }
}
