import { Prize } from '@/backend/src/prizes/entities/prize.entity';
import { PrizeProposals } from '@/backend/src/prizes/entities/prize-proposals.entity';
import { CreatePrizeProposalDto } from '@/backend/src/prizes/dto/create-prize-proposal.dto';
import { Submission } from '@/backend/src/prizes/entities/submission.entity';
import { InfinityPaginationResultType } from '@/backend/src/utils/types/infinity-pagination-result.type';
import { IPaginationOptions } from '@/backend/src/utils/types/pagination-options';

interface Submission extends Submission {}
interface Prize extends Prize {}
interface PrizeProposals extends PrizeProposals {}
interface PrizeProposalsList extends InfinityPaginationResultType<PrizeProposals> {}
interface CreatePrizeProposalDto extends CreatePrizeProposalDto {}
interface PrizeProposalQueryParams extends IPaginationOptions {}
