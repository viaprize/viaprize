import { Injectable } from '@nestjs/common';
import { CreatePact } from './dto/create-pact.dto';
import { PactEntity } from './entities/pact.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
/* The PactsService class is responsible for creating, finding, and retrieving pact entities, and it
also uses the MailService to perform a test operation. */
@Injectable()
export class PactsService {
  constructor(
    @InjectRepository(PactEntity)
    private pactRepository: Repository<PactEntity>,
    private mailService: MailService,
  ) {}
  async create(createPact: CreatePact) {
    const pact = this.pactRepository.create(createPact);
    await this.pactRepository.insert(pact);
    return pact;
  }

  async findAll() {
    return this.pactRepository.find({});
  }

  findOne(address: string) {
    return this.pactRepository.findOne({ where: { address } });
  }
}
