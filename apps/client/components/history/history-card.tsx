import { Badge, Card, Group, Text } from '@mantine/core';

interface HistoryCardProps {
  status: string;
  datePosted: string;
  title: string;
  description: string;
  awarded: string;
}

export default function HistoryCard({
  status,
  datePosted,
  title,
  description,
  awarded,
}: HistoryCardProps) {
  return (
    <Card
      padding="lg"
      radius="lg"
      withBorder
      className="shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
      pos="relative"
    >
      <Group justify="space-between">
        <Badge color="green">{status}</Badge>
        <Badge color="blue" variant="light" p="sm">
          Date Posted : {datePosted}
        </Badge>
      </Group>
      <Text size="xl" mt="sm" fw={600}>
        {title}
      </Text>
      <p className="text-md h-15 overflow-y-auto">{description}</p>
      <Group justify="space-between">
        <Text fw={500}>
          AWARDED : <span className='font-extrabold'>{awarded}</span>
        </Text>
        <Badge color="gray" variant="light" radius="sm">
          HACKATHON
        </Badge>
      </Group>
    </Card>
  );
}
