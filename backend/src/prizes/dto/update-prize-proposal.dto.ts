import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreatePrizeProposalDto } from './create-prize-proposal.dto';

export class UpdatePrizeDto extends PartialType(CreatePrizeProposalDto) {
  @IsNumber()
  @IsOptional()
  platformFeePercentage: number;

  @IsNumber()
  @IsOptional()
  proposerFeePercentage: number;
}
