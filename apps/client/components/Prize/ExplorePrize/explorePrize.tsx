/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable no-nested-ternary */
'use client';

import { PrizeStages } from '@/lib/api';
import { backendApi } from '@/lib/backend';
import { EXTRA_PRIZES } from '@/lib/constants';
import { getCorrectStage, toTitleCase } from '@/lib/utils';
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
import { FaUsers } from 'react-icons/fa';
import { FaSackDollar } from 'react-icons/fa6';
import { GiSandsOfTime, GiTwoCoins } from 'react-icons/gi';
import { PiTimerFill } from 'react-icons/pi';
import { useQuery } from 'react-query';

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
  startVoteBlockchain: number;
  slug: string;
  contestants: number;
  startSubmissionDate: Date;
  startVotingDate: Date;
  contributers: string[];
  stage: PrizeStages;
  refund: boolean;
  isActive: boolean;
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
  startVoteBlockchain,
  contestants,
  stage,
  refund,
  isActive,
}: ExploreCardProps) {
  const submissionDate =
    startingTimeBlockchain === 0
      ? startSubmissionDate
      : new Date(startingTimeBlockchain * 1000);
  console.log({ startingTimeBlockchain });
  const exactStage = getCorrectStage(
    startingTimeBlockchain,
    startVoteBlockchain,
    stage,
    distributed,
    refund,
    isActive,
  );

  const { data: extraData } = useQuery([`get-prize-extra-data-${id}`], async () => {
    if (EXTRA_PRIZES.includes(id)) {
      const final = await (await backendApi(false)).prizes.extraDataDetail(id);
      console.log({ final }, 'fionaodjs');
      return final;
    }
  });
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
              {stage === PrizeStages.NotStarted ||
              stage === PrizeStages.SubmissionStarted ? (
                <div className="flex items-center space-x-2">
                  <PiTimerFill />
                  <Text fw="bold">{toTitleCase(exactStage ?? '')}</Text>
                </div>
              ) : null}

              {refund ? <Badge color="yellow">Refunded</Badge> : null}

              {[
                PrizeStages.PrizeDistributed,
                PrizeStages.PrizeEnded,
                PrizeStages.SubmissionEnded,
                PrizeStages.VotingStarted,
                PrizeStages.VotingEnded,
                PrizeStages.PrizeEnded,
              ].includes(stage) && (
                <Badge color="blue" variant="light" p="sm">
                  {toTitleCase(exactStage ?? '')}
                </Badge>
              )}
            </div>
            <Group mb="xs" mt="md" justify="space-between">
              <h2 className="text-xl font-bold my-0">{title}</h2>
            </Group>
          </div>
          <div>
            <Flex gap="sm">{skills}</Flex>
            <div className="flex gap-2">
              <Tooltip label="Funds Allocated" withArrow>
                {/* <Button
                  variant="light"
                  color="yellow"
                  fullWidth
                  className="text-md font-bold cursor-pointer"
                  leftSection={<FaSackDollar />}
                >
                  {usdAmount} USD
                </Button> */}
                {EXTRA_PRIZES.includes(id) ? (
                  <Button
                    variant="light"
                    color="yellow"
                    fullWidth
                    className="text-md font-bold cursor-pointer"
                    leftSection={<FaSackDollar />}
                  >
                    {(
                      parseFloat(usdAmount) +
                      parseInt(extraData?.data.totalFundsInUsd.toString() ?? '0')
                    ).toFixed(2)}{' '}
                    USD
                  </Button>
                ) : (
                  <Button
                    variant="light"
                    color="yellow"
                    fullWidth
                    className="text-md font-bold cursor-pointer"
                    leftSection={<FaSackDollar />}
                  >
                    {parseFloat(usdAmount)} USD
                  </Button>
                )}
              </Tooltip>
              <Tooltip label="Submission Deadline" withArrow>
                <Button
                  variant="light"
                  color="red"
                  fullWidth
                  className="text-md font-bold cursor-pointer"
                  leftSection={<GiSandsOfTime />}
                >
                  {startingTimeBlockchain !== 0 ? (
                    <Text>
                      {exactStage?.includes('remaining')
                        ? exactStage.replace('remaining', '')
                        : exactStage}
                    </Text>
                  ) : (
                    <Text>Ended</Text>
                  )}
                </Button>
              </Tooltip>
            </div>
            <div className="flex gap-2 my-2">
              {contributers ? (
                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  className="text-md font-bold pointer-events-none"
                  leftSection={<GiTwoCoins />}
                >
                  {contributers.length} {contributers.length === 1 ? 'Funder' : 'Funders'}
                </Button>
              ) : null}
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

export default ExploreCard;
