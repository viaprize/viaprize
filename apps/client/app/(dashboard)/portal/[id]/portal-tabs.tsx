'use client';
import { Button, Tabs } from '@mantine/core';

import { TextEditor } from '@/components/richtexteditor/textEditor';
import type { Contributions } from '@/lib/api';
import DonationInfo from './donation-info';
import Updates from './updates';
import useAppUser from '@/components/hooks/useAppUser';

export default function PortalTabs({
  description,
  contributors,
  updates,
  owner,
}: {
  description: string;
  contributors?: Contributions;
  updates: string[];
  owner: string;
}) {
  const { appUser } = useAppUser();

  const isOwner = owner === appUser?.username || appUser?.isAdmin; // TODO: replace with actual username

  console.log(updates, 'updates');

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
          <div className="flex justify-between w-full p-4">
            <h3>Updates</h3>
            {isOwner ? <Button className="my-3">Add Update</Button> : null}
          </div>
          <Updates updates={updates} />
        </Tabs.Panel>
      </div>
    </Tabs>
  );
}
