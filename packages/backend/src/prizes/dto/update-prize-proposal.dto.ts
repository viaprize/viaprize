import { PartialType } from '@nestjs/swagger';
import { CreatePrizeProposalDto } from './create-prize-proposal.dto';

export class UpdatePrizeDto extends PartialType(CreatePrizeProposalDto) {}
