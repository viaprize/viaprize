import type { ProposalStatus } from '@/lib/types';
import { htmlToPlainText } from '@/lib/utils';
import { Badge, Button, Card, Divider, Group, Image, Text } from '@mantine/core';

interface ExploreCardProps {
  imageUrl: string;
  title: string;
  description: string;
  status: ProposalStatus;
  onStatusClick: (status: ProposalStatus) => void | Promise<void>;
  rejectedReason?: string;
}

function ProposalExploreCard({
  imageUrl,
  title,
  description,
  status,
  onStatusClick,
  rejectedReason,
}: ExploreCardProps) {
  return (
    <Card padding="lg" radius="md" shadow="sm" withBorder>
      <Card.Section>
        <Image alt="Image" height={160} src={imageUrl} />
      </Card.Section>
      <Group mb="xs" mt="md" justify="space-between">
        <Text fw={500}>{title}</Text>
        <Badge
          // eslint-disable-next-line no-nested-ternary -- its understandable
          color={status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'gray'}
          variant="light"
          my="sm"
        >
          {status}
        </Badge>
      </Group>
      <p className="text-md text-gray-500 max-h-14 overflow-y-auto">
        {htmlToPlainText(description)}
      </p>
      {status === 'rejected' && (
        <>
          <Divider my="sm" />
          <Text c="red" fw="bold">
            Rejected Reason
          </Text>
          <Text>{rejectedReason}</Text>
        </>
      )}
      {/* <Button color="blue" fullWidth mt="md" radius="md" variant="light">
          Details
        </Button> */}
      <Button my="xs" onClick={() => void onStatusClick(status)}>
        {status === 'approved' ? 'Deploy Proposal' : 'Edit Proposal'}
      </Button>
    </Card>
  );
}

export default ProposalExploreCard;
