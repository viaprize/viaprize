'use client';

import { calculateDeadline, htmlToPlainText } from '@/lib/utils';
import { chain } from '@/lib/wagmi';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CopyButton,
  Flex,
  Group,
  Image,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { PiTimerFill } from 'react-icons/pi';

interface ExploreCardProps {
  imageUrl: string;
  title: string;
  profileName: string;
  description: string;
  money: string;
  createdAt: string;
  id: string;
  skills: string[];
  submissionDays: number;
}

function ExploreCard({
  imageUrl,
  profileName,
  title,
  description,
  money,
  createdAt,
  id,
  skills,
  submissionDays,
}: ExploreCardProps) {
  const deadlineString = calculateDeadline(createdAt, submissionDays);

  return (
    <Card
      padding="lg"
      radius="md"
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
      <div className="flex items-center my-3 gap-2 text-red-600">
        <PiTimerFill
        // color='red'
        />
        <Text
          // c="red"
          fw="bold"
        >
          {deadlineString.remainingTime}
        </Text>
      </div>
      <Group mb="xs" mt="md" justify="space-between">
        <Text fw={500}>{title}</Text>
        <Badge color="primary" variant="gradient" p="sm">
          {profileName}
        </Badge>
      </Group>
      <p
        className="text-md h-20 overflow-y-auto"
        // dangerouslySetInnerHTML={{ __html: description }}
      >
        {htmlToPlainText(description)}
      </p>
      {/*  >{htmlToPlainText(description)}</p> */}
      <Flex gap="sm">{skills}</Flex>
      <Text fw="bold" size="xl">
        {money} {chain.nativeCurrency.symbol}
      </Text>
      <Text fw="bold">Submission Deadline : {deadlineString.dateString}</Text>

      <Button
        color="primary"
        component="a"
        fullWidth
        mt="md"
        radius="md"
        href={`/prize/${id}`}
      >
        Details
      </Button>
      <div className="absolute top-2 right-2">
        <CopyButton value={`https://pactsmith.com/prize/${id}`}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Share URL'} withArrow>
              <ActionIcon size="lg" onClick={copy} color={copied ? 'teal' : 'blue'}>
                {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </div>
    </Card>
  );
}

export default ExploreCard;
