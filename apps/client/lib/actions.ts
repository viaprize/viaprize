'use server';

import { gql } from '@apollo/client';
import { gitcoinGraphClient } from 'config/graphql';
import { Application, RoundForExplorer } from 'types/gitcoin.types';

const FETCH_ROUND_BY_EXPLORER = gql`
  query getRoundForExplorer($roundId: String!, $chainId: Int!) {
    rounds(
      first: 1
      filter: { id: { equalTo: $roundId }, chainId: { equalTo: $chainId } }
    ) {
      id
      chainId
      uniqueDonorsCount
      applicationsStartTime
      applicationsEndTime
      donationsStartTime
      donationsEndTime
      matchTokenAddress
      roundMetadata
      roundMetadataCid
      applicationMetadata
      applicationMetadataCid
      strategyId
      projectId
      strategyAddress
      strategyName
      readyForPayoutTransaction
      applications(first: 1000, filter: { status: { equalTo: APPROVED } }) {
        id
        projectId
        status
        metadata
        anchorAddress
        totalAmountDonatedInUsd

        project: canonicalProject {
          id
          metadata
          anchorAddress
        }
      }
    }
  }
`;

const FETCH_APPLICATIONS = gql`
  query Applications($chainId: Int!, $roundId: String!) {
    applications(
      first: 1000
      condition: { chainId: $chainId, roundId: $roundId, status: APPROVED }
    ) {
      id
      chainId
      roundId
      projectId
      status
      totalAmountDonatedInUsd
      uniqueDonorsCount
      totalDonationsCount
      anchorAddress
      round {
        strategyName
        donationsStartTime
        donationsEndTime
        applicationsStartTime
        applicationsEndTime
        matchTokenAddress
        roundMetadata
      }
      metadata
      project: canonicalProject {
        tags
        id
        metadata
        anchorAddress
      }
    }
  }
`;

export const fetchRoundForExplorer = async (
  chainId: number,
  roundId: string,
): Promise<RoundForExplorer> => {
  console.log('Fetching data for nodeId:', roundId, chainId); // Log the nodeId
  const { data, errors } = await gitcoinGraphClient.query<{ rounds: RoundForExplorer[] }>(
    {
      query: FETCH_ROUND_BY_EXPLORER,
      variables: { chainId, roundId },
      fetchPolicy: 'no-cache',
    },
  );

  console.log('GraphQL query:', FETCH_ROUND_BY_EXPLORER.loc?.source.body); // Log the query
  console.log('Variables:', { roundId, chainId }); // Log the variables
  if (errors) {
    console.error('GraphQL errors:', errors); // Log any errors
  }
  console.log('GraphQL response data:', data.rounds[0].applications); // Log the response data

  const { data: applicationData, errors: applicationErrors } =
    await gitcoinGraphClient.query<{ applications: Application[] }>({
      query: FETCH_APPLICATIONS,
      variables: { chainId, roundId },
      fetchPolicy: 'no-cache',
    });

  if (applicationErrors) {
    console.error('GraphQL errors:', applicationErrors); // Log any errors
  }

  return {
    ...data.rounds[0],
    applications: applicationData.applications,
  };
};

const FETCH_APPLICATION_ID = gql`
  query Application($chainId: Int!, $applicationId: String!, $roundId: String!) {
    applications(
      first: 1
      condition: {
        status: APPROVED
        chainId: $chainId
        id: $applicationId
        roundId: $roundId
      }
    ) {
      id
      chainId
      roundId
      projectId
      status
      totalAmountDonatedInUsd
      uniqueDonorsCount
      totalDonationsCount
      anchorAddress
      round {
        strategyName
        donationsStartTime
        donationsEndTime
        applicationsStartTime
        applicationsEndTime
        matchTokenAddress
        roundMetadata
      }
      metadata
      project: canonicalProject {
        tags
        id
        metadata
        anchorAddress
      }
    }
  }
`;

export const fetchApplicationById = async (
  applicationId: string,
  chainId: number,
  roundId: string,
): Promise<Application> => {
  const { data, errors } = await gitcoinGraphClient.query<{
    applications: Application[];
  }>({
    query: FETCH_APPLICATION_ID,
    variables: { chainId, applicationId, roundId },
    fetchPolicy: 'no-cache',
  });

  console.log({ data }, 'jsklflsdf');

  console.log('GraphQL query:', FETCH_APPLICATION_ID.loc?.source.body); // Log the query
  console.log('Variables:', { chainId, applicationId, roundId }); // Log the variables
  if (errors) {
    console.error('GraphQL errors:', errors); // Log any errors
  }
  console.log('GraphQL response data:', data); // Log the response data

  return data.applications[0];
};
