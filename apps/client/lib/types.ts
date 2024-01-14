/* eslint-disable  -- this is removed soon */

export interface PactDetail {
  end: number;
  sum: any;
  address: string;
  balance: number;
  blockHash: string;
  name: string;
  resolvable: boolean;
  resolved: boolean;
  safe: string;
  terms: string;
  transactionHash: string;
}

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
  [key: string]: string | string[] | undefined
}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}