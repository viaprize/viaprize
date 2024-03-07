'use client';
import { Badge, Card, Group, Text, Image } from '@mantine/core';

interface HistoryCardProps {
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
}: HistoryCardProps) {
  const statusColor = status.toLowerCase() === 'won' ? 'green' : 'red';

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
      <Group mt='xs' justify="space-between ">
        <Badge color={statusColor}>{status}</Badge>
        <Badge color="blue" variant="light" p="sm">
          Date Posted : {datePosted}
        </Badge>
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
    </Card>
  );
}