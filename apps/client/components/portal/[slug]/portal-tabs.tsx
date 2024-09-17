'use client';
import { Button, Tabs } from '@mantine/core';

import useAppUser from '@/components/hooks/useAppUser';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import type { Contributions } from '@/lib/api';
import { useRouter } from 'next/navigation';
import DonationInfo from './donation-info';
import Updates from './updates';

export default function PortalTabs({
  description,
  contributors,
  updates,
  owner,
  id,
  slug,
}: {
  description: string;
  contributors?: Contributions;
  updates: string[];
  owner: string;
  id: string;
  slug: string;
}) {
  const { appUser } = useAppUser();

  const isOwner = owner === appUser?.username || appUser?.isAdmin; // TODO: replace with actual username
  const router = useRouter();

  console.log(updates, 'updates');

  const launched = true;

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
          <DonationInfo contributors={contributors} id={id} />
        </Tabs.Panel>
        <Tabs.Panel value="updates">
          {launched ? (
            <>
              <div className="flex justify-between w-full p-4">
                <h3>Updates</h3>
                {isOwner ? (
                  <Button
                    className="my-3"
                    onClick={() => {
                      router.push(`/portal/${slug}/add-update`);
                    }}
                  >
                    Add Update
                  </Button>
                ) : null}
              </div>
              <Updates updates={updates} />{' '}
            </>
          ) : (
            <div className="flex justify-center items-center h-40">
              <h3>Feature Coming Soon.....</h3>
            </div>
          )}
        </Tabs.Panel>
      </div>
    </Tabs>
  );
}
