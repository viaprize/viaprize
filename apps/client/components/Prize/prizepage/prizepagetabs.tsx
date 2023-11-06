import { Tabs } from '@mantine/core';
import { BsInfoLg } from 'react-icons/bs';
import { FaMoneyBillWaveAlt } from 'react-icons/fa';

import { useBalance } from 'wagmi';
import AboutPrize from './aboutprize';
import PrizeFunderCard from './prizeFunderCard';

export default function PrizePageTabs({ contractAddress }: { contractAddress: string }) {
  const { data: balance, refetch } = useBalance({
    address: contractAddress as `0x${string}`,
  });
  // const interval = useInterval(async () => {
  //   console.log("hiii")
  //   await refetch()
  // }
  //   , 5000)
  // useEffect(() => {
  //   interval.start()

  // }, [])
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
        <AboutPrize balanceWithDenomation={`${balance?.formatted} ${balance?.symbol}`} />
      </Tabs.Panel>
      <Tabs.Panel value="creators">
        <PrizeFunderCard name="test" email="test" />
      </Tabs.Panel>
    </Tabs>
  );
}
