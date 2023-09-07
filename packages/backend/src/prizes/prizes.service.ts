import { Injectable } from '@nestjs/common';
import { CreatePrizeProposalDto } from './dto/create-prize-proposal.dto';
import { UpdatePrizeDto } from './dto/update-prize-proposal.dto';

@Injectable()
export class PrizesService {
  create(createPrizeDto: CreatePrizeProposalDto) {
    return 'This action adds a new prize';
  }

  findAll() {
    return `This action returns all prizes`;
  }

  findOne(id: number) {
    return `This action returns a ${id} prize`;
  }

  update(id: number, updatePrizeDto: UpdatePrizeDto) {
    return `This action updates a #${id} prize`;
  }

  remove(id: number) {
    return `This action removes a #${id} prize`;
  }
}
