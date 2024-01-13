'use client';

import { formatDate, htmlToPlainText } from '@/lib/utils';
import { chain } from '@/lib/wagmi';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CopyButton,
  Group,
  Image,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { PiTimerFill } from 'react-icons/pi';

interface PortalCardProps {
  ethToUsd: number;
  imageUrl: string;
  title: string;
  authorName: string;
  description: string;
  amountRaised: string;
  totalContributors: string;
  id: string;
  typeOfPortal: string;
  fundingGoal: number;
  deadline?: string;
  isActive: boolean;
  tags: string[];
}

export default function PortalCard({
  imageUrl,
  title,
  authorName,
  description,
  amountRaised,
  totalContributors,
  typeOfPortal,
  id,
  fundingGoal,
  deadline,
  ethToUsd,
  isActive,
  tags,
}: PortalCardProps) {
  return (
    <Card
      padding="lg"
      radius="lg"
      withBorder
      className="shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
      pos="relative"
    >
      <Card.Section>
        <Image
          alt="Image"
          height={160}
          src={
            imageUrl ||
            'https://placehold.jp/24/3d4070/ffffff/1280x720.png?text=No%20Image'
          }
        />
      </Card.Section>
      {isActive ? (
        <div className="flex items-center mt-3 gap-2 text-green-600">
          <PiTimerFill />
          <Text fw="bold">Accepting Donation</Text>
        </div>
      ) : (
        <div className="flex items-center mt-3 gap-2 text-red-600">
          <PiTimerFill />
          <Text fw="bold">Campaign Ended</Text>
        </div>
      )}
      <Group mt="sm" justify="space-between">
        <Text fw="bold" size="lg">
          {title}
        </Text>
        <Badge color="blue" variant="light" p="sm">
          {authorName}
        </Badge>
      </Group>
      <p
        className="text-md  h-20 overflow-y-auto"
        // dangerouslySetInnerHTML={{ __html: description }}
      >
        {htmlToPlainText(description)}
      </p>

      <Text fw="bold" size="xl">
        {(parseFloat(amountRaised) * ethToUsd).toFixed(2)} USD (
        {parseFloat(amountRaised).toFixed(3)}
        {chain.nativeCurrency.symbol} )
      </Text>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          return (
            <Badge key={tag} color="gray" variant="light" radius="sm">
              {tag}
            </Badge>
          );
        })}
      </div>

      {/* <Text size="xs" mt="xs">
        Raised from <span className="text-gray font-bold">{totalContributors} </span>
        contributions
      </Text> */}
      {fundingGoal !== 0 && (
        <Text size="xs" mt="sm" fw="bold">
          {(fundingGoal * ethToUsd).toFixed(2)} USD ({fundingGoal}{' '}
          {chain.nativeCurrency.symbol}) Funding Goal
        </Text>
      )}

      {deadline ? (
        <Text size="xs" fw="bold">
          Deadline: {formatDate(deadline)}
        </Text>
      ) : null}

      <Button
        color="primary"
        component="a"
        fullWidth
        mt="md"
        radius="md"
        href={`/portal/${id}`}
      >
        Details
      </Button>
      <div className="absolute top-2 right-2">
        <CopyButton value={`https://viaprize.org/portal/${id}`}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Share URL'} withArrow>
              <ActionIcon size="lg" onClick={copy} color={copied ? 'teal' : 'primary'}>
                {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </div>
    </Card>
  );
}
