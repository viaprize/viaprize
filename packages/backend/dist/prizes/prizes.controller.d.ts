import { PrizeProposalsService } from './services/prizes-proposals.service';
import { CreatePrizeProposalDto } from './dto/create-prize-proposal.dto';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { PrizeProposals } from './entities/prize-proposals.entity';
import { RejectProposalDto } from './dto/reject-proposal.dto';
export declare class PrizesController {
    private readonly prizeProposalsService;
    constructor(prizeProposalsService: PrizeProposalsService);
    getPendingProposals(page: number, limit: number): Promise<Readonly<{
        data: PrizeProposals[];
        hasNextPage: boolean;
    }>>;
    create(createPrizeProposalDto: CreatePrizeProposalDto, req: any): Promise<void>;
    getProposalsBy(page: number, limit: number, userId: any): Promise<InfinityPaginationResultType<PrizeProposals>>;
    getProposal(userId: string): Promise<PrizeProposals[]>;
    rejectProposal(id: string, rejectProposalDto: RejectProposalDto): Promise<void>;
    approveProposal(id: string): Promise<void>;
}
