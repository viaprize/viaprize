// lib/fetchRoundByNodeId.ts
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://grants-stack-indexer-v2.gitcoin.co/graphql',
  cache: new InMemoryCache(),
});

const FETCH_ROUND_BY_NODE_ID = gql`
  query MyQuery {
    roundByNodeId(nodeId: "WyJyb3VuZHMiLCIweDAwZDVlMGQzMWQzN2NjMTNjNjQ1ZDg2NDEwYWI0Y2I3Y2I0MjhjY2EiLDQyMTYxXQ==") {
      id
      applications {
        chainId
        anchorAddress
        createdAtBlock
        createdByAddress
        distributionTransaction
        roundId
        status
        statusUpdatedAtBlock
        totalAmountDonatedInUsd
        tags
        totalDonationsCount
        uniqueDonorsCount
        nodeId
        project {
          name
        }
      }
    }
  }
`;

export interface StatusSnapshot {
  status: string;
  updatedAt: string;
  updatedAtBlock: string;
}

export interface Application {
  chainId: number;
  anchorAddress: string | null;
  createdAtBlock: string;
  createdByAddress: string;
  distributionTransaction: string;
  roundId: string;
  status: string;
  statusSnapshots: StatusSnapshot[];
  statusUpdatedAtBlock: string;
  totalAmountDonatedInUsd: number;
  tags: string[];
  totalDonationsCount: number;
  uniqueDonorsCount: number;
  nodeId: string;
  project: {
    name: string;
  };
}

export interface RoundByNodeIdResponse {
  roundByNodeId: {
    id: string;
    applications: Application[];
  };
}

export const fetchRoundByNodeId = async (
  nodeId: string,
) => {
  const { data } = await client.query({
    query: FETCH_ROUND_BY_NODE_ID,
    variables: { nodeId },
  });

  return data;
};
