import { Submission } from './submission.entity';
export declare class Prize {
    id: string;
    description: string;
    isAutomatic: boolean;
    startVotingDate: Date;
    startSubmissionDate: Date;
    proposer_address: string;
    contract_address: string;
    admins: string[];
    proficiencies: string[];
    priorities: string[];
    created_at: Date;
    updated_at: Date;
    submissions: Submission[];
}
