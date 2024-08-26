import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreatePortalProposalDto } from './create-portal-proposal.dto';

export class UpdatePortalPropsalDto extends PartialType(
  CreatePortalProposalDto,
) {
  @IsNumber()
  @IsOptional()
  platformFeePercentage: number;
}
