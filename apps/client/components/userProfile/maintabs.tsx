'use client';

import { Divider, Tabs } from '@mantine/core';
import PortalProposalsTabs from './portal-proposals-tabs';
import ProfilePrizeSubmission from './prize-submissions';
import PrizeTabs from './all-prize-tabs';
import ProposalsTabs from './prize-proposals-tabs';

export default function MainTabsUserProfile({ params }: { params: { id: string } }) {
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
        <PrizeTabs params={params} />
      </Tabs.Panel>
      <Tabs.Panel value="prize-proposals">
        <ProposalsTabs params={params} />
      </Tabs.Panel>
      <Tabs.Panel value="portal-proposals">
        <PortalProposalsTabs params={params} />
      </Tabs.Panel>
      <Tabs.Panel value="submissions">
        <ProfilePrizeSubmission params={params} />
      </Tabs.Panel>
    </Tabs>
  );
}
