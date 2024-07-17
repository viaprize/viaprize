/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable no-nested-ternary */
'use client';

import { calculateDeadline } from '@/lib/utils';
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
import { format, parse } from 'date-fns';
import { FaUsers } from 'react-icons/fa';
import { GiSandsOfTime, GiTwoCoins } from 'react-icons/gi';
import { PiTimerFill } from 'react-icons/pi';
import { FaSackDollar } from 'react-icons/fa6';

interface ExploreCardProps {
  distributed: boolean;
  imageUrl: string;
  title: string;
  profileName: string;
  description: string;
  usdAmount: string;
  createdAt: string;
  id: string;
  skills: string[];
  submissionMinutes: number;
  startingTimeBlockchain: number;
  slug: string;
  contestants: number;
  startSubmissionDate: Date;
  startVotingDate: Date;
  contributers: string[];
}

function ExploreCard({
  imageUrl,
  profileName,
  title,
  description,
  usdAmount,
  createdAt,
  id,
  skills,
  distributed,
  startingTimeBlockchain,
  slug,
  submissionMinutes,
  startSubmissionDate,
  contributers,
  contestants,
}: ExploreCardProps) {
  const submissionEndDate = new Date(startingTimeBlockchain * 1000);
  const deadlineString = calculateDeadline(new Date(), submissionEndDate);

  return (
    <div className="relative">
      <div className="absolute z-10 top-2 right-2">
        <CopyButton value={`https://viaprize.org/prize/${slug}`}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Share URL'} withArrow>
              <ActionIcon size="lg" onClick={copy} color={copied ? 'teal' : 'primary'}>
                {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </div>
      <Card
        component="a"
        href={`/prize/${slug}`}
        padding="lg"
        radius="md"
        withBorder
        className="shadow hover:shadow-lg transition-all duration-300 ease-in-out "
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
        <div className="flex flex-col justify-between h-full">
          <div>
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

              {deadlineString === 'Time is up!' && distributed === true ? (
                <Badge color="green">Won</Badge>
              ) : deadlineString === 'Time is up!' &&
                distributed === false &&
                parseInt(usdAmount) > 0 &&
                startingTimeBlockchain ? (
                <Badge color="yellow">Refunded</Badge>
              ) : null}
            </div>
            <Group mb="xs" mt="md" justify="space-between">
              <h2 className="text-xl font-bold my-0">{title}</h2>
              {/* <Badge color="blue" variant="light" p="sm" radius="md">
              {profileName}
            </Badge> */}
            </Group>
            {/* <p
            className="text-md h-20 overflow-y-auto"
            // dangerouslySetInnerHTML={{ __html: description }}
          >
            {htmlToPlainText(description)}
          </p> */}
          </div>
          <div>
            {/*  >{htmlToPlainText(description)}</p> */}
            <Flex gap="sm">{skills}</Flex>
            <div className="flex gap-2">
              <Tooltip label="Funds Allocated" withArrow>
                <Button
                  variant="light"
                  color="yellow"
                  fullWidth
                  className="text-md font-bold cursor-pointer"
                  leftSection={<FaSackDollar />}
                >
                  {usdAmount} USD
                </Button>
              </Tooltip>
              <Tooltip label="Submission Deadline" withArrow>
                <Button
                  variant="light"
                  color="red"
                  fullWidth
                  className="text-md font-bold cursor-pointer"
                  leftSection={<GiSandsOfTime />}
                >
                  <Text fw="bold" className="flex">
                    {new Date() < submissionEndDate ? (
                      formatDateString(submissionEndDate.toLocaleDateString())
                    ) : (
                      <Text c="red" fw="bold" className="pl-2">
                        Ended
                      </Text>
                    )}
                  </Text>
                </Button>
              </Tooltip>
            </div>
            {/* <Text fw="bold" size="xl">
            {usdAmount} USD
          </Text>
          <Text fw="bold" className="flex">
            Submission Deadline :{' '}
            {new Date() < submissionEndDate ? (
              formatDateString(submissionEndDate.toLocaleDateString())
            ) : (
              <Text c="red" fw="bold" className="pl-2">
                Ended
              </Text>
            )}
          </Text> */}
            <div className="flex gap-2 my-2">
              <Button
                variant="light"
                color="blue"
                fullWidth
                className="text-md font-bold pointer-events-none"
                leftSection={<GiTwoCoins />}
              >
                {contributers.length} {contributers.length === 1 ? 'Funder' : 'Funders'}
              </Button>
              <Tooltip label="Individuals working on winning this prize" withArrow>
                <Button
                  variant="light"
                  color="green"
                  fullWidth
                  className="text-md font-bold pointer-events-none"
                  leftSection={<FaUsers />}
                >
                  {contestants} {contestants === 1 ? 'Contestant' : 'Contestants'}
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function formatDateString(dateString: string): string {
  // Parse the date string to a Date object
  const date = parse(dateString, 'M/d/yyyy', new Date());

  // Format the Date object to the desired format
  const formattedDate = format(date, 'd MMMM yyyy');

  return formattedDate;
}

export default ExploreCard;
