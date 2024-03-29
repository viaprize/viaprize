'use client';
import {
  Badge,
  Card,
  Group,
  Text,
  Image,
  Button,
  ActionIcon,
  CopyButton,
  Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

interface HistoryCardProps {
  id: number;
  status: string;
  datePosted: string;
  title: string;
  description: string;
  awarded: string;
  imageUrl: string;
}

export default function HistoryCard({
  status,
  datePosted,
  title,
  description,
  awarded,
  imageUrl,
  id,
}: HistoryCardProps) {
  const statusColor = status.toLowerCase() === 'won' ? 'green' : 'yellow';

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
      <Group mt="xs" justify="space-between ">
        <Badge color={statusColor}>{status}</Badge>
        {datePosted?.length > 0 ? (
          <Badge color="blue" variant="light" p="sm">
            Date Posted : {datePosted}
          </Badge>
        ) : (
          <Text>No date posted</Text>
        )}
      </Group>
      <Text size="xl" mt="sm" fw={600}>
        {title}
      </Text>
      <p className="text-md max-h-16  overflow-y-auto">{description}</p>
      <Group justify="space-between">
        <Text fw={500}>
          AWARDED : <span className="font-extrabold">{awarded}</span>
        </Text>
        <Badge color="gray" variant="light" radius="sm">
          HACKATHON
        </Badge>
      </Group>
      <Button
        color="primary"
        component="a"
        fullWidth
        mt="md"
        radius="md"
        href={`/prize/old/${id}`}
      >
        Details
      </Button>
      <div className="absolute top-2 right-2">
        <CopyButton value={`https://viaprize.org/prize/old/${id}`}>
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
