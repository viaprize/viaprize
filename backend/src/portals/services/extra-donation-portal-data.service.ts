import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtraDonationPortalData } from '../entities/extra-donation-portal-data.entity';

@Injectable()
export class ExtraDonationPortalDataService {
  constructor(
    @InjectRepository(ExtraDonationPortalData)
    private portalRepository: Repository<ExtraDonationPortalData>,
  ) {}

  async getDonationByExternalId(
    externalId: string,
  ): Promise<ExtraDonationPortalData[]> {
    const portalData = await this.portalRepository.find({
      where: {
        externalId: externalId,
      },
    });
    return portalData;
  }
}
