import { PrizeProposalsService } from './services/prizes-proposals.service';
import { CreatePrizeProposalDto } from './dto/create-prize-proposal.dto';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { PrizeProposals } from './entities/prize-proposals.entity';
export declare class PrizesController {
    private readonly prizeProposalsService;
    constructor(prizeProposalsService: PrizeProposalsService);
    create(createPrizeProposalDto: CreatePrizeProposalDto, req: any): Promise<void>;
    getProposalsBy(page: number, limit: number, userId: any): Promise<InfinityPaginationResultType<PrizeProposals>>;
    getProposal(id: string): Promise<PrizeProposals | null>;
    approveProposal(id: string): Promise<void>;
}
