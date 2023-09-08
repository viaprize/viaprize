import { Tabs, TabsProps, rem, } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';
import AboutPrize from './aboutprize';



export default function PrizePageTabs() {
  return (
    <Tabs className='w-full' variant='pills' value="about">
      <Tabs.List position="center" grow>
        <Tabs.Tab value="about" icon={<IconSettings size="1rem" />}>
          About
        </Tabs.Tab>
        <Tabs.Tab value="creators" icon={<IconMessageCircle size="1rem" />}>
          Backed By
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='about'>
        <AboutPrize/>
      </Tabs.Panel>
    </Tabs>
  );
}