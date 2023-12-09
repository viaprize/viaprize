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
  limit: 10,
  page: 1,
}

export type ProposalStatus = 'pending' | 'approved' | 'rejected';
