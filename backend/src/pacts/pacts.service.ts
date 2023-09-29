import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { CreatePact } from './dto/create-pact.dto';
import { Pact } from './entities/pact.entity';
/* The PactsService class is responsible for creating, finding, and retrieving pact entities, and it
also uses the MailService to perform a test operation. */
@Injectable()
export class PactsService {
  constructor(
    @InjectRepository(Pact)
    private pactRepository: Repository<Pact>,
    private mailService: MailService,
  ) { }
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
