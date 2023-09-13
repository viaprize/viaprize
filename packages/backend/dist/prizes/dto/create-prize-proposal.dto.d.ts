import { Priority, Proficiency } from '../entities/types';
export declare class CreatePrizeProposalDto {
    voting_time: number;
    submission_time: number;
    admins: string[];
    title: string;
    description: string;
    proposer_address: string;
    isAutomatic: boolean;
    startVotingDate?: Date;
    startSubmissionDate?: Date;
    proficiencies: Proficiency[];
    priorities: Priority[];
    images: string[];
}
