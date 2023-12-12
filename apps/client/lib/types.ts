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
export interface Query {
  limit: number;
  page: number;
}

export type ProposalStatus = 'pending' | 'approved' | 'rejected';
