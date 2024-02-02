'use client';
import { Tabs } from '@mantine/core';

import { TextEditor } from '@/components/richtexteditor/textEditor';
import type { Contributions } from '@/lib/api';
import DonationInfo from './donation-info';
import Shell from '@/components/custom/shell';

export default function PortalTabs({
  description,
  contributors,
  updates,
}: {
  description: string;
  contributors?: Contributions;
  updates: string[];
}) {
  return (
    <Tabs variant="pills" defaultValue="about" mt="md">
      <Tabs.List grow>
        <Tabs.Tab value="about" className="">
          About
        </Tabs.Tab>
        <Tabs.Tab value="donations">Donations</Tabs.Tab>
        <Tabs.Tab value="updates">Updates</Tabs.Tab>
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
        <Tabs.Panel value="updates">
          <div className="my-5">
            {updates.length > 1 ? (
              updates.map((update) => (
                <div key={update.slice(10)} className="my-3">
                  <TextEditor disabled richtext={update} />
                </div>
              ))
            ) : (
              <Shell>No Updates Yet</Shell>
            )}
          </div>
        </Tabs.Panel>
      </div>
    </Tabs>
  );
}
