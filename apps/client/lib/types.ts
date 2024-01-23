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
