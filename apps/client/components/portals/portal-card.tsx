'use client';

import { backendApi } from '@/lib/backend';
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
import Link from 'next/link';
import { PiTimerFill } from 'react-icons/pi';
import { useQuery } from 'wagmi';

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
  fundingGoalWithPlatformFee: number;
  deadline?: string;
  isActive: boolean;
  tags: string[];
  isIframe: boolean;
  slug: string;
}

export default function PortalCard({
  imageUrl,
  title,
  authorName,
  description,
  amountRaised,
  id,
  fundingGoalWithPlatformFee,
  deadline,
  ethToUsd,
  isActive,
  tags,
  isIframe,
  slug,
}: PortalCardProps) {
  const isRefunded = !isActive && parseFloat(amountRaised) < fundingGoalWithPlatformFee;
  const { data: extraData } = useQuery([`get-extra-data-${id}`], async () => {
    const final = await (await backendApi(false)).portals.extraDataDetail(id);
    console.log({ final }, 'fionaodjs');
    return final;
  });

  const filteredTags = tags.filter(
    (tag) =>
      tag !== 'All-or-Nothing' &&
      tag !== 'Refundable' &&
      tag !== 'Pass-Through' &&
      tag !== 'Pass-through' &&
      tag !== 'Deadline' &&
      tag !== 'Funding Goal' &&
      tag !== 'All or Nothing',
  );

  const badgetags = tags.filter((tag) => tag === 'Refundable');

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
          <Text fw="bold">{isRefunded ? 'Refunded' : 'Campaign Ended Successfully'}</Text>
        </div>
      )}
      <Group mt="sm" justify="space-between">
        <Text fw="bold" size="lg">
          {title}
        </Text>
        <Badge color="blue" variant="light" p="sm">
          {authorName}
        </Badge>
        {badgetags.map((tag) => {
          let badgeColor = 'gray'; // Default color for badges

          // Check for specific tags and set badge color accordingly
          if (tag === 'Refundable') {
            badgeColor = 'yellow';
          } else if (tag === 'Pass-Through' || tag === 'Pass-through') {
            badgeColor = 'green';
          }

          return (
            <Badge key={tag} color={badgeColor} radius="lg">
              {tag}
            </Badge>
          );
        })}
      </Group>

      <p
        className="text-md  h-20 overflow-y-auto"
        // dangerouslySetInnerHTML={{ __html: description }}
      >
        {htmlToPlainText(description)}
      </p>

      <Text fw="bold" size="xl">
        {id === 'bacb6584-7e45-465b-b4af-a3ed24a84233' ? (
          <>
            {(
              parseFloat(amountRaised) * ethToUsd +
              parseInt(extraData?.data.funds.toString() ?? '0')
            ).toFixed(2)}{' '}
            USD
          </>
        ) : (
          <>{parseFloat(amountRaised)} USD</>
        )}
      </Text>
      <div className="flex flex-wrap gap-2">
        {filteredTags.map((tag) => {
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
      {fundingGoalWithPlatformFee !== 0 && (
        <Text size="xs" mt="sm" fw="bold">
          {(fundingGoalWithPlatformFee * ethToUsd).toFixed(2)} USD (
          {fundingGoalWithPlatformFee} {chain.nativeCurrency.symbol}) Funding Goal
        </Text>
      )}

      {deadline ? (
        <Text size="xs" fw="bold">
          Deadline: {formatDate(deadline)}
        </Text>
      ) : null}

      {isIframe ? (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={`https://viaprize.org/portal/${slug}`}
        >
          <Button color="primary" component="a" fullWidth mt="md" radius="md">
            Details
          </Button>
        </Link>
      ) : (
        <Button
          color="primary"
          component="a"
          fullWidth
          mt="md"
          radius="md"
          href={`/portal/${slug}`}
        >
          Details
        </Button>
      )}

      <div className="absolute top-2 right-2">
        <CopyButton value={`https://www.viaprize.org/portal/${slug}`}>
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
