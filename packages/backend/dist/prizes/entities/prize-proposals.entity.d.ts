import { User } from 'src/users/entities/user.entity';
export declare class PrizeProposals {
    id: string;
    platform_reward: number;
    distributed: boolean;
    voting_time: number;
    submission_time: number;
    admins: string[];
    isApproved: boolean;
    description: string;
    isAutomatic: boolean;
    startVotingDate: Date;
    startSubmissionDate: Date;
    proficiencies: string[];
    priorities: string[];
    images: string[];
    user: User;
}
