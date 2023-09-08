import { Tabs} from '@mantine/core';
import AboutPrize from './aboutprize';
import {BsInfoLg} from 'react-icons/bs'
import { FaMoneyBillWaveAlt } from 'react-icons/fa';



export default function PrizePageTabs() {
  return (
    <Tabs className='w-full' variant='pills' value="about">
      <Tabs.List position="center" grow>
        <Tabs.Tab value="about" icon={<BsInfoLg size="1rem" />}>
          About
        </Tabs.Tab>
        <Tabs.Tab value="creators" icon={<FaMoneyBillWaveAlt size="1rem" />}>
          Backed By
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='about'>
        <AboutPrize/>
      </Tabs.Panel>
    </Tabs>
  );
}