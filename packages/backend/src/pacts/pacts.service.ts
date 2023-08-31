import { Injectable } from '@nestjs/common';
import { CreatePactDto } from './dto/create-pact.dto';
import { PactEntity } from './entities/pact.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class PactsService {
  constructor(
    @InjectRepository(PactEntity)
    private packRepository: Repository<PactEntity>,
  ) {}
  create(createPactDto: CreatePactDto, networkType: string) {
    const createPact = { ...createPactDto, networkType };
    return this.packRepository.save(createPact);
  }

  findAll(networkType: string) {
    return this.packRepository.find({
      where: { networkType },
    });
  }

  findOne(address: string) {
    return this.packRepository.findOne({ where: { address } });
  }
}
