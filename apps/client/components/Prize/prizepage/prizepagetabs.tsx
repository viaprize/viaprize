import { Tabs } from '@mantine/core';
import { BsInfoLg } from 'react-icons/bs';
import { FaMoneyBillWaveAlt } from 'react-icons/fa';

import AboutPrize from './aboutprize';
import PrizeFunderCard from './prizeFunderCard';

export default function PrizePageTabs() {
  return (
    <Tabs className="w-full" variant="pills" defaultValue="about">
      <Tabs.List justify="center" grow>
        <Tabs.Tab value="about" leftSection={<BsInfoLg size="1rem" />}>
          About
        </Tabs.Tab>
        <Tabs.Tab value="creators" leftSection={<FaMoneyBillWaveAlt size="1rem" />}>
          Backed By
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="about">
        <AboutPrize />
      </Tabs.Panel>
      <Tabs.Panel value="creators">
        <PrizeFunderCard name="test" email="test" />
      </Tabs.Panel>
    </Tabs>
  );
}
