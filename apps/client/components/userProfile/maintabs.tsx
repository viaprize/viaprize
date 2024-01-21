'use client';

import { Divider, Tabs } from '@mantine/core';
import PortalProposalsTabs from './portal-proposals-tabs';
import PrizeTab from './prize-tab';

export default function MainTabsUserProfile({ params }: { params: { id: string } }) {
  return (
    <Tabs defaultValue="prizes" variant="pills" m="lg" className="w-full">
      <Tabs.List grow justify="center">
        <Tabs.Tab value="prizes">Prize</Tabs.Tab>
        <Tabs.Tab value="portal-proposals">Portal Proposals</Tabs.Tab>
      </Tabs.List>
      <Divider my="sm" />

      <Tabs.Panel value="prizes">
        <PrizeTab params={params} />
      </Tabs.Panel>

      <Tabs.Panel value="portal-proposals">
        <PortalProposalsTabs params={params} />
      </Tabs.Panel>
    </Tabs>
  );
}
