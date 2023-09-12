import AdminCard from '@/components/Admin/card';
import AppShellLayout from '@/components/layout/appshell';
import { Tabs } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';
import { ReactElement } from 'react';

export default function AdminPage() {
  return (
    <Tabs variant="pills" defaultValue="pending">
      <Tabs.List>
        <Tabs.Tab value="pending" >
          Pending Requests
        </Tabs.Tab>
        <Tabs.Tab className='mx-2' value="accepted" >
          Accepted Requests
        </Tabs.Tab>
      
      </Tabs.List>

      <Tabs.Panel value="pending" pt="xs">
      <AdminCard id="some-id" />
      </Tabs.Panel>

      <Tabs.Panel value="accepted" pt="xs">
      <AdminCard id="some-id" />
      </Tabs.Panel>

    </Tabs>
  );
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};