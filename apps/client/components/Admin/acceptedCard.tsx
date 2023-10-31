import { User } from '@/lib/api';
import { Badge, Button, Card, Group, Image, Modal, Text } from '@mantine/core';
import { useState } from 'react';
import ViewDetails from './details';

interface AdminCardProps {
  images: string[];
  user: User;
  title: string;
  description: string;
  admins: string[];
  voting: number;
  submission: number;
}

const AdminAcceptedCard: React.FC<AdminCardProps> = ({
  images,
  admins,
  description,
  submission,
  title,
  user,
  voting,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder my="md">
        <Card.Section>
          {images.length > 0
            ? images.map((image) => (
                <Image src={image} height={160} alt="Image" key={image} width={346} />
              ))
            : null}
        </Card.Section>
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>{title}</Text>
          <Badge color="gray" variant="light">
            {user.name}
          </Badge>
        </Group>
        <p className="text-md text-gray-500 max-h-14 overflow-y-auto">
          Click on View Details to See Description
        </p>
        <Group justify="space-evenly" mt="md" mb="xs">
          <Text fw={500} color="red">
            Submission Days is {submission} Days
          </Text>
          <Button
            onClick={() => {
              setDetailsOpen(true);
            }}
          >
            View Details
          </Button>
        </Group>
      </Card>
      <Modal
        size="xl"
        opened={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
        }}
        title="Prize details"
      >
        <ViewDetails
          user={user}
          admins={admins}
          images={images}
          description={description}
          title={title}
          submission={submission}
          voting={voting}
        />
      </Modal>
    </>
  );
};

export default AdminAcceptedCard;
