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
import { PrizeProposals } from 'types/prizes';
import { AppUser } from 'types/app-user';

interface AdminCardProps {
  images: string[]
  user: AppUser,
  title: string,
  description: string,
  admins: string[],
  voting: number,
  submission: number

}

const AdminCard: React.FC<AdminCardProps> = ({ images, admins, description, submission, title, user, voting }) => {
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
  const [rejectOpen, setRejectOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  console.log({ images }, "in admin card")
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder my="md">
        <Card.Section>
          {
            images.length > 0 ? (

              images.map((image) => (
                <Image
                  src={image}
                  height={160}
                  alt="Image"
                  key={image}
                  width={346}
                />
              )
              ))
              : null
          }
        </Card.Section>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{title}</Text>
          <Badge color="gray" variant="light">
            {user.name}
          </Badge>
        </Group>
        <p className="text-md text-gray-500 max-h-14 overflow-y-auto">Click on View Details to See Description</p>
        <Group position="apart" mt="md" mb="xs">

          <Text weight={500} color="red">
            Submission Days is {submission} Days
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
        <ViewDetails user={user} admins={admins} images={images} description={description} title={title} submission={submission} voting={voting} />
      </Modal>
    </>
  );
};

export default AdminCard;
