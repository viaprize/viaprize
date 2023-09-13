import { User } from 'src/users/entities/user.entity';
export declare class PrizeProposals {
    id: string;
    voting_time: number;
    submission_time: number;
    admins: string[];
    isApproved: boolean;
    title: string;
    description: string;
    isAutomatic: boolean;
    startVotingDate: Date;
    startSubmissionDate: Date;
    proficiencies: string[];
    priorities: string[];
    images: string[];
    user: User;
}
