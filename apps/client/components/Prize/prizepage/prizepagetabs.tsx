import { Tabs, Text } from '@mantine/core';
import { BsInfoLg } from 'react-icons/bs';
import { FaMoneyBillWaveAlt } from 'react-icons/fa';

import { formatEther } from 'viem';
import AboutPrize from './aboutprize';
import PrizeFunderCard from './prizeFunderCard';

export default function PrizePageTabs({
  contractAddress,
  description,
  name,
  email,
  totalFunds,
  submissionDeadline,
  votingDeadline,
}: {
  contractAddress: string;
  description: string;
  name: string;
  email: string;
  totalFunds: number;
  submissionDeadline?: Date;
  votingDeadline?: Date;
}) {
  console.log(contractAddress, 'contractAddress');
  console.log(totalFunds.toString(), 'HIIIIIIIIIIIIIIii');
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
        <AboutPrize
          description={description}
          amount={formatEther(BigInt(totalFunds)).toString()}
          contractAddress={contractAddress}
        />
        <div className="flex justify-between">
          <div>
            {submissionDeadline && (
              <Text size="lg">
                Submission Deadline:{' '}
                <Text c="red">{submissionDeadline?.toLocaleString()}</Text>
              </Text>
            )}
            {votingDeadline && (
              <Text size="lg">
                Voting Deadline: <Text c="red">{votingDeadline?.toLocaleString()}</Text>
              </Text>
            )}
          </div>
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="creators">
        <PrizeFunderCard name={name} email={email} />
      </Tabs.Panel>
    </Tabs>
  );
}
