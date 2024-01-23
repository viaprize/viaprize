'use client';

import { Divider, Tabs } from '@mantine/core';
import PortalTabs from './portal-tabs';
import PrizeTab from './prize-tab';

export default function MainTabsUserProfile({ params }: { params: { id: string } }) {
  return (
    <Tabs defaultValue="prizes" variant="pills" m="lg" className="w-full">
      <Tabs.List grow justify="center">
        <Tabs.Tab value="prizes">Prize</Tabs.Tab>
        <Tabs.Tab value="portals">Portal</Tabs.Tab>
      </Tabs.List>
      <Divider my="sm" />
      <Tabs.Panel value="prizes">
        <PrizeTab params={params} />
      </Tabs.Panel>
      <Tabs.Panel value="portals">
        <PortalTabs params={params} />
      </Tabs.Panel>
    </Tabs>
  );
}
