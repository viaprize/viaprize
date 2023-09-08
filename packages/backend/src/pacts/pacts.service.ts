import { Injectable } from '@nestjs/common';
import { CreatePactDto } from './dto/create-pact.dto';
import { PactEntity } from './entities/pact.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class PactsService {
  constructor(
    @InjectRepository(PactEntity)
    private packRepository: Repository<PactEntity>,
    private mailService: MailService,
  ) {}
  create(createPactDto: CreatePactDto, networkType: string) {
    const createPact = { ...createPactDto, networkType };
    return this.packRepository.save(createPact);
  }

  async findAll(networkType: string) {
    await this.mailService.test();
    return this.packRepository.find({
      where: { networkType },
    });
  }

  findOne(address: string) {
    return this.packRepository.findOne({ where: { address } });
  }
}
