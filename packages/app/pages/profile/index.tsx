import AppShellLayout from '@/components/layout/appshell';
import { Tabs } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';
import { ReactElement } from 'react';

export default function Profile() {
  return (
    <Tabs variant="pills" defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab value="gallery" icon={<IconPhoto size="0.8rem" />}>
          Gallery
        </Tabs.Tab>
        <Tabs.Tab value="messages" icon={<IconMessageCircle size="0.8rem" />}>
          Messages
        </Tabs.Tab>
        <Tabs.Tab value="settings" icon={<IconSettings size="0.8rem" />}>
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery" pt="xs">
        Gallery tab content
      </Tabs.Panel>

      <Tabs.Panel value="messages" pt="xs">
        Messages tab content
      </Tabs.Panel>

      <Tabs.Panel value="settings" pt="xs">
        Settings tab content
      </Tabs.Panel>
    </Tabs>
  );
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};
