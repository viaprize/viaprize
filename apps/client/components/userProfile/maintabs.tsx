import { Divider, Loader, Skeleton, Tabs } from '@mantine/core';

import { backendApi } from '@/lib/backend';
import { useRouter } from 'next/router';
import { formatEther } from 'viem';
import { usePublicClient, useQuery } from 'wagmi';
import ExploreCard from '../ExplorePrize/explorePrize';
import SubmissionsCard from '../Prize/prizepage/submissionsCard';
import usePrizeProposal from '../hooks/usePrizeProposal';
import ProposalsTabs from './proposals-tabs';

export default function MainTabsUserProfile() {
  const { getProposalsOfUser } = usePrizeProposal();
  const { query } = useRouter();
  const getProposalsOfUserMutation = useQuery(['getProposalsOfUser', undefined], () => {
    return getProposalsOfUser({ limit: 10, page: 1 }, query.id as string);
  });
  const client = usePublicClient();
  const getPrizesOfUserMutation = useQuery(['getPrizesOfUser', undefined], async () => {
    const prizes = await (
      await backendApi()
    ).users.usernamePrizesDetail(query.id as string);

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
      return (await backendApi()).users.usernameSubmissionsDetail(query.id as string);
    },
  );
  return (
    <Tabs defaultValue="proposals" variant="pills" m="lg" className="md:w-2/3">
      <Tabs.List grow justify="center">
        <Tabs.Tab value="prizes">Prize</Tabs.Tab>
        <Tabs.Tab value="proposals">Proposals</Tabs.Tab>
        <Tabs.Tab value="submissions">Submissions</Tabs.Tab>
      </Tabs.List>
      <Divider my="sm" />

      <Tabs.Panel value="prizes">
        {getPrizesOfUserMutation.isLoading && <Loader color="orange" />}

        <Skeleton visible={getPrizesOfUserMutation.isLoading}>
          {getPrizesOfUserMutation.data?.map((prize) => (
            <ExploreCard
              description={prize.description}
              imageUrl={prize.images[0]}
              deadline=""
              money={formatEther(BigInt(prize.balance))}
              profileName={''}
              title={prize.title}
              key={prize.id}
              id={prize.id}
            />
          ))}
        </Skeleton>
      </Tabs.Panel>
      <Tabs.Panel value="proposals">
        <ProposalsTabs
          data={getProposalsOfUserMutation.data}
          isSuccess={getProposalsOfUserMutation.isSuccess}
        />
      </Tabs.Panel>
      <Tabs.Panel value="submissions">
        <div className="w-full flex justify-center items-center">
          {getSubmissionsOfUserMutation.isLoading && <Loader color="green" />}

          <Skeleton visible={getSubmissionsOfUserMutation.isLoading}>
            {getSubmissionsOfUserMutation.data?.data?.map((submission) => (
              <SubmissionsCard
                allowVoting={false}
                contractAddress={''}
                description={submission.submissionDescription}
                fullname={''}
                hash={submission.submissionHash}
                showVote={false}
                votes={0}
                submissionId={submission.id}
                time={''}
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
