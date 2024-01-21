'use client';

import { backendApi } from '@/lib/backend';
import { Divider, Loader, Skeleton, Tabs } from '@mantine/core';
import { formatEther } from 'viem';
import { usePublicClient, useQuery } from 'wagmi';
import ExploreCard from '../Prize/ExplorePrize/explorePrize';
import SubmissionsCard from '../Prize/prizepage/submissionsCard';
import usePortalProposal from '../hooks/usePortalProposal';
import usePrizeProposal from '../hooks/usePrizeProposal';
import PortalProposalsTabs from './portal-proposals-tabs';
import ProposalsTabs from './proposals-tabs';

export default function MainTabsUserProfile({ params }: { params: { id: string } }) {
  const { getProposalsOfUser } = usePrizeProposal();
  const getPrizeProposalOfUserMutation = useQuery(
    ['getProposalsOfUser', undefined],
    () => {
      return getProposalsOfUser({ limit: 10, page: 1 }, params.id);
    },
  );
  
  const client = usePublicClient();
  const getPrizesOfUserMutation = useQuery(['getPrizesOfUser', undefined], async () => {
    const prizes = await (await backendApi()).users.usernamePrizesDetail(params.id);

    const prizesWithBalancePromise = prizes.data.map(async (prize) => {
      const balance = await client.getBalance({
        address: prize.contract_address as `0x${string}`,
      });
      return {
        ...prize,
        balance,
      };
    });
    const prizesWithBalance = await Promise.all(prizesWithBalancePromise);

    return prizesWithBalance;
  });

  const getSubmissionsOfUserMutation = useQuery(
    ['getSubmissionsOfUser', undefined],
    async () => {
      return (await backendApi()).users.usernameSubmissionsDetail(params.id);
    },
  );

  return (
    <Tabs defaultValue="prizes" variant="pills" m="lg" className="w-full">
      <Tabs.List grow justify="center">
        <Tabs.Tab value="prizes">Prize</Tabs.Tab>
        <Tabs.Tab value="prize-proposals">Prize Proposals</Tabs.Tab>
        <Tabs.Tab value="portal-proposals">Portal Proposals</Tabs.Tab>
        <Tabs.Tab value="submissions">Submissions</Tabs.Tab>
      </Tabs.List>
      <Divider my="sm" />

      <Tabs.Panel value="prizes">
        {getPrizesOfUserMutation.isLoading ? <Loader color="orange" /> : null}
        <Skeleton visible={getPrizesOfUserMutation.isLoading}>
          {getPrizesOfUserMutation.data?.map((prize) => {
            return (
              <ExploreCard
                distributed={false}
                description={prize.description}
                submissionDays={prize.submissionTime}
                createdAt={prize.created_at}
                imageUrl={prize.images[0]}
                money={formatEther(BigInt(prize.balance))}
                profileName=""
                title={prize.title}
                key={prize.id}
                id={prize.id}
                skills={prize.priorities || prize.proficiencies}
              />
            );
          })}
        </Skeleton>
      </Tabs.Panel>
      <Tabs.Panel value="prize-proposals">
        <ProposalsTabs
          data={getPrizeProposalOfUserMutation.data}
          isSuccess={getPrizeProposalOfUserMutation.isSuccess}
        />
      </Tabs.Panel>
      <Tabs.Panel value="portal-proposals">
        <PortalProposalsTabs
          params={params}
        />
      </Tabs.Panel>
      <Tabs.Panel value="submissions">
        <div className="w-full flex justify-center items-center">
          {getSubmissionsOfUserMutation.isLoading ? <Loader color="green" /> : null}
          <Skeleton visible={getSubmissionsOfUserMutation.isLoading}>
            {getSubmissionsOfUserMutation.data?.data.map((submission) => (
              <SubmissionsCard
                allowVoting={false}
                contractAddress=""
                description={submission.submissionDescription}
                fullname=""
                hash={submission.submissionHash}
                showVote={false}
                votes={0}
                submissionId={submission.id}
                time=""
                wallet={submission.submitterAddress}
                key={submission.id}
              />
            ))}
          </Skeleton>
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}
