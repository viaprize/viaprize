import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  ScrollArea,
  Modal,
  Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import ViewDetails from './details';

interface AdminCardProps {
  id: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ id }) => {
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
  const [rejectOpen, setRejectOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            height={160}
            alt="Image"
          />
        </Card.Section>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Title</Text>
          <Badge color="gray" variant="light">
            Profile Name
          </Badge>
        </Group>
        <p className="text-md text-gray-500 max-h-14 overflow-y-auto">Description</p>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500} color="green">
            Money
          </Text>
          <Text weight={500} color="red">
            Deadline
          </Text>
        </Group>
        <Group>
          <Button onClick={() => setDetailsOpen(true)}>View Details</Button>

          <Button color="red" onClick={() => setRejectOpen(true)}>
            Reject
          </Button>
          <Button color="green">Accept</Button>
        </Group>
      </Card>
      <Modal
        opened={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Write your rejection reason"
      >
        <Textarea
          placeholder="Your comment"
          label="Your comment"
          variant="filled"
          radius="md"
          withAsterisk
        />
        <Group position="right" my="md">
          <Button onClick={() => setRejectOpen(false)}>Cancel</Button>
          <Button color="red">Reject</Button>
        </Group>
      </Modal>
      <Modal
      size='xl'
        opened={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Prize details"
      >
        <ViewDetails />
      </Modal>
    </>
  );
};

export default AdminCard;
