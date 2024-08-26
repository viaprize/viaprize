/* eslint-disable  -- this is removed soon */
export type ConvertUSD = {
  ethereum: {
    usd: number;
  };
};
export interface Query {
  limit: number;
  page: number;
}

export type ProposalStatus = 'pending' | 'approved' | 'rejected';

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export enum PrizeStages {
  NOT_STARTED = 'not started',
  SUMISSION_STARTED = 'submission started',
  SUBMISSION_ENDED = 'submission ended',
  VOTING_STARTED = 'voting started',
  VOTING_ENDED = 'voting ended',
  PRIZE_DISTRIBUTED = 'prize distributed',
  PRIZE_ENDED = 'prize ended',
}
