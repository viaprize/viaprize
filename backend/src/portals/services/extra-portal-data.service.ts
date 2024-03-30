import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtraPortal } from '../entities/extra-portal-data.entity';

@Injectable()
export class ExtraPortalDataService {
  constructor(
    @InjectRepository(ExtraPortal)
    private portalRepository: Repository<ExtraPortal>,
  ) {}

  async getFundByExternalId(externalId: string) : Promise<ExtraPortal> {
    const portalData = await this.portalRepository.findOneOrFail({
      where: {
        externalId: externalId,
      },
    });
    return portalData;
  }
}
