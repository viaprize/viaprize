'use client';
import { Badge, Tabs, Text } from '@mantine/core';
import { BsInfoLg } from 'react-icons/bs';
import { FaMoneyBillWaveAlt } from 'react-icons/fa';

import { Contributions } from '@/lib/api';
import { backendApi } from '@/lib/backend';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { useQuery } from 'react-query';
import AboutPrize from './aboutprize';
import Contestants from './contestants';
import PrizeFunderCard from './prizeFunderCard';

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
  prizeId,
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
  prizeId: string;
}) {
  const { data: donations } = useQuery(
    [`get-extra-data-donation-${contractAddress}`],
    async () => {
      const donations = (
        await (await backendApi()).prizes.extraDataDonationsDetail(prizeId)
      ).data;
      return donations;
    },
  );
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
          amountIn=""
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
            amountIn="USD"
            username={contribution.contributor}
          />
        ))}
        {donations &&
          donations.map((donation) => (
            <PrizeFunderCard
              key={donation.id}
              name={donation.donor}
              email={donation.donor}
              badge={parseFloat(donation.value.toString())}
              // avatar={contribution.avatar}
              date={new Date(donation.donationTime).toISOString()}
              amountIn={donation.valueIn}
              username={donation.donor}
            />
          ))}
      </Tabs.Panel>
      <Tabs.Panel value="contestants">
        <Contestants />
      </Tabs.Panel>
    </Tabs>
  );
}
