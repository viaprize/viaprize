import { Badge, Tabs, Text } from '@mantine/core';
import { BsInfoLg } from 'react-icons/bs';
import { FaMoneyBillWaveAlt } from 'react-icons/fa';

import AboutPrize from './aboutprize';
import Contestants from './contestants';
import PrizeFunderCard from './prizeFunderCard';
import { Contributions } from '@/lib/api';
import { StarFilledIcon } from '@radix-ui/react-icons';

export default function PrizePageTabs({
  contractAddress,
  description,
  name,
  email,
  totalFunds,
  submissionDeadline,
  votingDeadline,
  avatar,
  username,
  contributions,
}: {
  contractAddress: string;
  description: string;
  name: string;
  email: string;
  totalFunds: number;
  submissionDeadline?: Date;
  votingDeadline?: Date;
  avatar: string;
  username: string;
  contributions: Contributions;
}) {
  return (
    <Tabs className="w-full" variant="pills" defaultValue="about">
      <Tabs.List justify="center" grow>
        <Tabs.Tab value="about" leftSection={<BsInfoLg size="1rem" />}>
          About
        </Tabs.Tab>
        <Tabs.Tab value="creators" leftSection={<FaMoneyBillWaveAlt size="1rem" />}>
          Backed By{' '}
          <Badge color="green" rightSection={<StarFilledIcon />}>
            {contributions.data.length}
          </Badge>
        </Tabs.Tab>
        <Tabs.Tab value="contestants">Contestants</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="about">
        <AboutPrize
          description={description}
          amount={totalFunds.toString()}
          contractAddress={contractAddress}
        />
        <div className="flex justify-between">
          <div>
            {submissionDeadline ? (
              <Text size="lg">
                Submission Deadline:{' '}
                <Text c="red">{submissionDeadline.toLocaleString()}</Text>
              </Text>
            ) : null}
            {votingDeadline ? (
              <Text size="lg">
                Voting Deadline: <Text c="red">{votingDeadline.toLocaleString()}</Text>
              </Text>
            ) : null}
          </div>
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="creators">
        <PrizeFunderCard
          name={name}
          email={email}
          avatar={avatar}
          username={username}
          badge="Proposer"
        />
        {contributions.data.map((contribution) => (
          <PrizeFunderCard
            key={contribution.contributor}
            name={contribution.contributor}
            email={contribution.contributor}
            badge={parseFloat(contribution.amount) / 1_000_000}
            // avatar={contribution.avatar}
            date={contribution.donationTime}
            username={contribution.contributor}
          />
        ))}
      </Tabs.Panel>
      <Tabs.Panel value="contestants">
        <Contestants />
      </Tabs.Panel>
    </Tabs>
  );
}
