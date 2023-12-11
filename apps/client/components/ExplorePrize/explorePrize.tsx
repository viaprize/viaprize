'use client';

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
import { calculateDeadline, htmlToPlainText } from '@/lib/utils';
import { chain } from '@/lib/wagmi';

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
      <Group mb="xs" mt="md" justify="space-between">
        <Text fw={500}>{title}</Text>
        <Badge color="blue" variant="light" p="sm">
          {profileName}
        </Badge>
      </Group>
      <p
        className="text-md text-gray-500 h-20 overflow-y-auto"
        // dangerouslySetInnerHTML={{ __html: description }}
      >
        {htmlToPlainText(description)}
      </p>
      {/*  >{htmlToPlainText(description)}</p> */}
      <Flex gap="sm">{skills}</Flex>
      <Text fw="bold" c="black" size="xl">
        {money} {chain.nativeCurrency.symbol}
      </Text>
      <Flex justify="space-between" align="center">
        <Text c="blue">Submission Deadline : {deadlineString.dateString}</Text>

        {deadlineString.remainingTime}
      </Flex>

      <Button
        color="blue"
        component="a"
        fullWidth
        mt="md"
        radius="md"
        variant="light"
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
