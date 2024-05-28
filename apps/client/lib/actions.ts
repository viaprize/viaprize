'use server';

import { gql } from '@apollo/client';
import { gitcoinGraphClient } from 'config/graphql';
import type { ApplicationByNodeIdResponse, RoundByNodeIdResponse } from './gitcoin-types';

const FETCH_ROUND_BY_NODE_ID = gql`
  query MyQuery($nodeId: ID!) {
    roundByNodeId(nodeId: $nodeId) {
      id
      applications(filter: { status: { equalTo: APPROVED } }) {
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
        metadata
      }
    }
  }
`;

export const fetchRoundByNodeId = async (
  nodeId: string,
): Promise<RoundByNodeIdResponse> => {
  console.log('Fetching data for nodeId:', nodeId); // Log the nodeId
  const { data, errors } = await gitcoinGraphClient.query<RoundByNodeIdResponse>({
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


const FETCH_APPLICATION_BY_NODE_ID = gql`
  query MyQuery($nodeId: ID!) {
    applicationByNodeId(nodeId: $nodeId) {
      id
      nodeId
      status
      totalAmountDonatedInUsd
      totalDonationsCount
      uniqueDonorsCount
      metadataCid
      project {
        projectNumber
        tags
        name
        projectType
        createdByAddress
      }
    }
  }
`;

export const fetchApplicationByNodeId = async (
  nodeId: string,
): Promise<ApplicationByNodeIdResponse> => {
  const { data, errors } = await gitcoinGraphClient.query<ApplicationByNodeIdResponse>({
    query: FETCH_APPLICATION_BY_NODE_ID,
    variables: { nodeId },
  });

  console.log('GraphQL query:', FETCH_APPLICATION_BY_NODE_ID.loc?.source.body); // Log the query
  console.log('Variables:', { nodeId }); // Log the variables
  if (errors) {
    console.error('GraphQL errors:', errors); // Log any errors
  }
  console.log('GraphQL response data:', data); // Log the response data

  return data;
};
