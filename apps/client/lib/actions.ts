/* eslint-disable @typescript-eslint/restrict-template-expressions */
'use server';

import { ApolloClient, InMemoryCache, gql, ApolloLink, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const httpLink = new HttpLink({
  uri: 'https://grants-stack-indexer-v2.gitcoin.co/graphql',
});

const logLink = new ApolloLink((operation, forward) => {
  console.log(`GraphQL Request: ${operation.operationName}`);
  console.log('Variables:', operation.variables);
  console.log('Query:', operation.query.loc?.source.body);

  return forward(operation).map((response) => {
    console.log(`GraphQL Response: ${operation.operationName}`);
    console.log('Response:', response);
    return response;
  });
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, logLink, httpLink]),
  cache: new InMemoryCache(),
});

const FETCH_ROUND_BY_NODE_ID = gql`
  query MyQuery($nodeId: ID!) {
    roundByNodeId(nodeId: $nodeId) {
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
): Promise<RoundByNodeIdResponse> => {
  console.log('Fetching data for nodeId:', nodeId); // Log the nodeId
  const { data, errors } = await client.query<RoundByNodeIdResponse>({
    query: FETCH_ROUND_BY_NODE_ID,
    variables: { nodeId },
  });

  console.log('GraphQL query:', FETCH_ROUND_BY_NODE_ID.loc?.source.body); // Log the query
  console.log('Variables:', { nodeId }); // Log the variables
  if (errors) {
    console.error('GraphQL errors:', errors); // Log any errors
  }
  console.log('GraphQL response data:', data); // Log the response data

  return data;
};