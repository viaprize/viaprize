/* eslint-disable no-nested-ternary */
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
  distributed: boolean;
  imageUrl: string;
  title: string;
  profileName: string;
  description: string;
  ethAmount: string;
  usdAmount: string;
  createdAt: string;
  id: string;
  skills: string[];
  submissionDays: number;
  startingTimeBlockchain: number;
}

function ExploreCard({
  imageUrl,
  profileName,
  title,
  description,
  ethAmount,
  usdAmount,
  createdAt,
  id,
  skills,
  distributed,
  startingTimeBlockchain,
  submissionDays,
}: ExploreCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const deadlineString = calculateDeadline(
    new Date(),
    new Date(startingTimeBlockchain * 1000),
  );
  console.log(deadlineString, 'this is the deadline string');
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
      <div className="flex justify-between items-center my-3 gap-2 text-red-600">
        <div className="flex items-center space-x-2">
          <PiTimerFill
          // color='red'
          />
          <Text
            // c="red"
            fw="bold"
          >
            {deadlineString}
          </Text>
        </div>

        {/* {distributed ? <Text>Prize Has Ended</Text> : null} */}

        {deadlineString === 'Time is up!' && distributed === true ? (
          <Badge color="green">Won</Badge>
        ) : // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        deadlineString === 'Time is up!' && distributed === false ? (
          <Badge color="yellow">Refunded</Badge>
        ) : null}
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
        {usdAmount} USD
      </Text>
      <Text size="sm" c="gray">
        {ethAmount} {chain.nativeCurrency.symbol}
      </Text>
      <Text fw="bold" className="flex">
        Submission Deadline :{' '}
        {startingTimeBlockchain != 0 ? (
          new Date(startingTimeBlockchain * 1000).toLocaleDateString()
        ) : (
          <Text c="red" fw="bold" className="pl-2">
            Ended
          </Text>
        )}
      </Text>

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
        <CopyButton value={`https://viaprize.org/prize/${id}`}>
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
