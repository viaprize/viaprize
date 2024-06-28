import { User } from '@/lib/api';
import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  Modal,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useMutation } from 'react-query';
import usePrizeProposal from '../hooks/usePrizeProposal';
import ViewDetails from './details';

interface AdminCardProps {
  images: string[];
  user: User;
  title: string;
  description: string;
  admins: string[];
  voting: number;
  submission: number;
  id: string;
  proposerFeePercentage: number;
  platfromFeePercentage: number;
  startVotingDate: string;
  startSubmissionDate: string;
}

// Utility function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toString();
};

// Utility function to calculate remaining time
const calculateRemainingTime = (startDateString: string, durationMinutes: number) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  const now = new Date();

  const elapsedTime = now.getTime() - startDate.getTime();
  const remainingTime = endDate.getTime() - startDate.getTime();

  let remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  let remainingHours = Math.floor(
    (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  let remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

  if (elapsedTime < 0) {
    remainingDays = Math.floor(durationMinutes / (60 * 24));
    remainingHours = Math.floor((durationMinutes % (60 * 24)) / 60);
    remainingMinutes = durationMinutes % 60;
  }

  return {
    endDate: endDate.toString(),
    remainingDays,
    remainingHours,
    remainingMinutes,
  };
};

const AdminCard: React.FC<AdminCardProps> = ({
  id,
  images,
  admins,
  description,
  submission,
  title,
  user,
  voting,
  proposerFeePercentage,
  platfromFeePercentage,
  startVotingDate,
  startSubmissionDate,
}) => {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const { acceptProposal, rejectProposal, updateProposal } = usePrizeProposal();
  const acceptProposalMutation = useMutation(acceptProposal);
  const rejectProposalMutation = useMutation(rejectProposal);
  const [opened, { open, close }] = useDisclosure(false);
  const [newPlatfromFeePercentage, setnewPlatfromFeePercentage] =
    useState(platfromFeePercentage);
  const [newProposerFeePercentage, setnewProposerFeePercentage] =
    useState(proposerFeePercentage);
  const updateProposalMutation = useMutation(updateProposal);

  const submissionTime = calculateRemainingTime(startSubmissionDate, submission);
  const votingTime = calculateRemainingTime(startVotingDate, voting);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Update Fee Percentage" centered>
        <TextInput
          value={newPlatfromFeePercentage}
          onChange={(event) => {
            setnewPlatfromFeePercentage(parseInt(event.currentTarget.value));
          }}
          label={`${platfromFeePercentage} % is the Current Platform Fee for this proposal`}
          placeholder="Enter in %"
          description="Click Submit to confirm"
        />
        <TextInput
          value={newProposerFeePercentage}
          onChange={(event) => {
            setnewProposerFeePercentage(parseInt(event.currentTarget.value));
          }}
          label={`${proposerFeePercentage} % is the Current Proposer Fee for this proposal`}
          placeholder="Enter in %"
          description="Click Submit to confirm"
        />
        <Button
          onClick={async () => {
            await updateProposalMutation.mutateAsync({
              id,
              dto: {
                proposerFeePercentage: newProposerFeePercentage,
                platformFeePercentage: newPlatfromFeePercentage,
              },
            });
            window.location.reload();
          }}
          loading={updateProposalMutation.isLoading}
        >
          Confirm
        </Button>
      </Modal>
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
            Time from submission start to deadline.: {submissionTime.remainingDays} days{' '}
            {submissionTime.remainingHours} hours {submissionTime.remainingMinutes}{' '}
            minutes
          </Text>
          <Button
            onClick={() => {
              setDetailsOpen(true);
            }}
          >
            View Details
          </Button>
        </Group>
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
            startVotingDate={startVotingDate}
            startSubmissionDate={startSubmissionDate}
          />
        </Modal>
        <Group>
          <Button
            color="red"
            onClick={() => {
              setRejectOpen(true);
            }}
          >
            Reject
          </Button>
          <Button
            color="green"
            loading={acceptProposalMutation.isLoading}
            onClick={async () => {
              await acceptProposalMutation.mutateAsync(id);
              window.location.reload();
            }}
          >
            Accept
          </Button>
          <Button color="blue" onClick={open}>
            Edit
          </Button>
        </Group>
      </Card>
      <Modal
        opened={rejectOpen}
        onClose={() => {
          setRejectOpen(false);
        }}
        title="Write your rejection reason"
      >
        <Textarea
          placeholder="Your comment"
          label="Your comment"
          variant="filled"
          radius="md"
          withAsterisk
          value={comment}
          onChange={(event) => {
            setComment(event.currentTarget.value);
          }}
        />
        <Group justify="space-evenly" my="md">
          <Button
            onClick={() => {
              setRejectOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="red"
            loading={rejectProposalMutation.isLoading}
            onClick={async () => {
              const res = await rejectProposalMutation.mutateAsync({
                proposalId: id,
                comment,
              });
              console.log({ res }, 'this is the res');
              window.location.reload();
              setRejectOpen(false);
            }}
          >
            Reject
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default AdminCard;
