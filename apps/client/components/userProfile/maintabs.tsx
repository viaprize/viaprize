import { Tabs } from '@mantine/core';

import { useRouter } from 'next/router';
import { useQuery } from 'wagmi';
import usePrizeProposal from '../Prize/hooks/usePrizeProposal';
import ProposalsTabs from './proposals-tabs';

export default function MainTabsUserProfile() {
  const { getProposalsOfUser } = usePrizeProposal();
  const { query } = useRouter();
  const getProposalsOfUserMutation = useQuery(['getProposalsOfUser', undefined], () => {
    return getProposalsOfUser({ limit: 10, page: 1 }, query.username as string);
  });
  return (
    <Tabs defaultValue="proposals" mx="xl">
      <Tabs.List grow justify="center">
        <Tabs.Tab value="prizes">Prize</Tabs.Tab>
        <Tabs.Tab value="proposals">Proposals</Tabs.Tab>
        <Tabs.Tab value="submissions">Submissions</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="prizes">Prizes</Tabs.Panel>
      <Tabs.Panel value="proposals">
        <ProposalsTabs
          data={getProposalsOfUserMutation.data}
          isSuccess={getProposalsOfUserMutation.isSuccess}
        />
      </Tabs.Panel>
      <Tabs.Panel value="submissions">hhi bitch</Tabs.Panel>
    </Tabs>
  );
}
