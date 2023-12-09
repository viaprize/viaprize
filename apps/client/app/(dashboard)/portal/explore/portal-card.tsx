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
  imageUrl: string;
  title: string;
  authorName: string;
  description: string;
  amountRaised: string;
  totalContributors: string;
  shareUrl: string;
  id: string;
}

export default function PortalCards({
  imageUrl,
  title,
  authorName,
  description,
  amountRaised,
  totalContributors,
  shareUrl,
  id,
}: PortalCardProps) {
  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
      className="w-[700px] shadow-xs hover:shadow-lg transition duration-300 ease-in-out"
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
        className="text-md text-gray-500 h-20 overflow-y-auto"
        // dangerouslySetInnerHTML={{ __html: description }}
      >
        {description}
        {/* {htmlToPlainText(description)} */}
      </p>

      <Text fw="bold" c="blue" size="xl">
        {amountRaised}
      </Text>
      <Badge color="gray" variant="light" radius="sm">
        Total Amount Raised
      </Badge>

      <Text size="sm" c="gray">
        Raised from <span className="text-gray font-bold">{totalContributors} </span>
        contributions
      </Text>
      <Button
        color="blue"
        component="a"
        fullWidth
        mt="md"
        radius="md"
        variant="light"
        // href={`/prize/${id}`}
      >
        Donate
      </Button>
      <div className="absolute top-2 right-2">
        <CopyButton value={shareUrl || 'https://mantine.dev'}>
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