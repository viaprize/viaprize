import { PartialType } from '@nestjs/swagger';
import { CreatePortalProposalDto } from './create-portal-proposal.dto';

export class UpdatePortalPropsalDto extends PartialType(
  CreatePortalProposalDto,
) {}
