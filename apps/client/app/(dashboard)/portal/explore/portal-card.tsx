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
}: PortalCardProps) {
  console.log((parseFloat(amountRaised) * ethToUsd).toFixed(2));
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

      {isActive ? (
        <Text fw="bold" size="xl">
          Accepting Donation
        </Text>
      ) : (
        <Text fw="bold" size="xl" c={'red'}>
          Campaign Ended
        </Text>
      )}

      <Badge color="gray" variant="light" radius="sm">
        {typeOfPortal}
      </Badge>
      {/* <Badge color="gray" variant="light" radius="sm">
        Total Amount Raised
      </Badge> */}

      {/* <Text size="xs" mt="xs">
        Raised from <span className="text-gray font-bold">{totalContributors} </span>
        contributions
      </Text> */}
      {fundingGoal !== 0 && (
        <Text size="xs" mt="xs">
          {(fundingGoal * ethToUsd).toFixed(2)} USD ({fundingGoal}{' '}
          {chain.nativeCurrency.symbol}) Funding Goal
        </Text>
      )}

      {deadline && (
        <Text size="xs" mt="xs">
          Deadline: {formatDate(deadline)}
        </Text>
      )}

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
