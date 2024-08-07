import { Contributions } from 'src/blockchain/blockchain';
import { Prize } from '../../prizes/entities/prize.entity';
export interface PrizeWithBalance extends Prize {
  distributed: boolean;
  balance: number;
}
export interface PrizeWithBlockchainData extends PrizeWithBalance {
  distributed: boolean;
  submission_time_blockchain: number;
  voting_time_blockchain: number;
  dispute_period_time_blockchain: number;
  refunded: boolean;
  voting_period_active_blockchain: boolean;
  is_active_blockchain: boolean;
  submission_perio_active_blockchain: boolean;
  contributors: string[];
}

export interface IndividualPrizeWithBalance
  extends Omit<PrizeWithBlockchainData, 'contributors'> {
  contributors: Contributions;
}
