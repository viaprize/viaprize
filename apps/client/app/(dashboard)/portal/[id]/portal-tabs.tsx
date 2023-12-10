'use client';
import { Tabs } from '@mantine/core';

import React from 'react';
import DonationInfo from './donation-info';

export default function PortalTabs() {
  return (
    <Tabs variant="pills" defaultValue="about" mt="md">
      <div className="bg-white">
        <Tabs.List grow>
          <Tabs.Tab value="about" className="">
            About
          </Tabs.Tab>
          <Tabs.Tab value="donations">Donations</Tabs.Tab>
        </Tabs.List>
      </div>
      <div className="">
        <Tabs.Panel value="about">All the Rich Text info</Tabs.Panel>

        <Tabs.Panel value="donations">
          <DonationInfo />
        </Tabs.Panel>
      </div>
    </Tabs>
  );
}
