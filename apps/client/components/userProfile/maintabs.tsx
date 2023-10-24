import { Tabs } from '@mantine/core';

import React from 'react';
import ProposalsTabs from './proposals-tabs';

export default function MainTabsUserProfile() {
  return (
    <Tabs defaultValue="proposals" mx="xl">
      <Tabs.List grow position="center">
        <Tabs.Tab value="proposals">Proposals</Tabs.Tab>
        <Tabs.Tab value="submissions">Submissions</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="proposals">
        <ProposalsTabs />
      </Tabs.Panel>
      <Tabs.Panel value="submissions">hhi bitch</Tabs.Panel>
    </Tabs>
  );
}
