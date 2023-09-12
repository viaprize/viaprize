import { PrizeProposals } from 'src/prizes/entities/prize-proposals.entity';
import { Submission } from 'src/prizes/entities/submission.entity';
export declare class User {
    id: string;
    email: string;
    user_id: string;
    name: string;
    submissions: Submission[];
    prizeProposals: PrizeProposals[];
}
