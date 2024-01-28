'use client';
import { Tabs } from '@mantine/core';

import { TextEditor } from '@/components/richtexteditor/textEditor';
import DonationInfo from './donation-info';
import { Contributions } from '@/lib/api';

export default function PortalTabs({
  description,
  contributors,
}: {
  description: string;
  contributors?: Contributions;
}) {
  return (
    <Tabs variant="pills" defaultValue="about" mt="md">
      <Tabs.List grow>
        <Tabs.Tab value="about" className="">
          About
        </Tabs.Tab>
        <Tabs.Tab value="donations">Donations</Tabs.Tab>
      </Tabs.List>

      <div className="">
        <Tabs.Panel value="about">
          <div className="my-5">
            <TextEditor disabled richtext={description} />
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="donations">
          <DonationInfo contributors={contributors} />
        </Tabs.Panel>
      </div>
    </Tabs>
  );
}
