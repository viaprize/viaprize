import { ProposalStatus } from '@/lib/types';
import { Badge, Button, Card, Group, Image, Text } from '@mantine/core';

interface ExploreCardProps {
  imageUrl: string;
  title: string;
  description: string;
  status: ProposalStatus;
  onStatusClick: (status: ProposalStatus) => void | Promise<void>;
}

const ProposalExploreCard: React.FC<ExploreCardProps> = ({
  imageUrl,
  title,
  description,
  status,
  onStatusClick,
}) => {
  return (
    <Card padding="lg" radius="md" shadow="sm" withBorder>
      <Card.Section>
        <Image alt="Image" height={160} src={imageUrl} />
      </Card.Section>
      <Group mb="xs" mt="md" justify="space-between">
        <Text fw={500}>{title}</Text>
        <Badge color="gray" variant="light">
          {status}
        </Badge>
      </Group>
      <p className="text-md text-gray-500 max-h-14 overflow-y-auto">{description}</p>

      <Button
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        variant="light"
        onClick={() => onStatusClick(status)}
      >
        Details
      </Button>
      {/* <Button onClick={() => onStatusClick}>{status}</Button> */}
    </Card>
  );
};

export default ProposalExploreCard;
