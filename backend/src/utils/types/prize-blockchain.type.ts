import { Prize } from '../../prizes/entities/prize.entity';
export interface PrizeWithBalance extends Prize {
    distributed: boolean;
    balance: number;
}
export interface PrizeWithBlockchainData extends PrizeWithBalance {
    distributed: boolean;
    submission_time_blockchain: number;
    voting_time_blockchain: number;
}