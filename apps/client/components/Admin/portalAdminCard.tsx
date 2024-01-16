import type { User } from '@/lib/api';
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
import type { SetStateAction } from 'react';
import { useState } from 'react';
import { useMutation } from 'wagmi';
import usePortalProposal from '../hooks/usePortalProposal';

interface AdminCardProps {
  images: string[];
  id: string;
  user: User;
  title: string;
  description: string;
  tresurers: string[];
  fundingGoal?: number;
  deadline: string;
  allowAboveFundingGoal: boolean;
  disableButton?: boolean;
  platfromFeePercentage: number;
}

function PortalAdminCard({
  images,
  tresurers,
  description,
  title,
  user,
  fundingGoal,
  id,
  deadline,
  allowAboveFundingGoal,
  platfromFeePercentage,
  disableButton = false,
}: AdminCardProps) {
  const { acceptProposal, rejectProposal, updateProposal } = usePortalProposal();
  const acceptProposalMutation = useMutation(acceptProposal);
  const rejectProposalMutation = useMutation(rejectProposal);
  const [comment, setComment] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [newPlatfromFeePercentage, setnewPlatfromFeePercentage] =
    useState(platfromFeePercentage);

  const updateProposalMutation = useMutation(updateProposal);
  console.log({ images }, 'in admin card');

  return (
    <>
      <Modal opened={opened} onClose={close} title="Update Fee Percentage" centered>
        <TextInput
          value={newPlatfromFeePercentage}
          label={`${platfromFeePercentage} % is the Current Platform Fee for this proposal`}
          onChange={(event) => {
            setnewPlatfromFeePercentage(parseInt(event.currentTarget.value));
          }}
          placeholder="Enter in %"
          description="Click Submit to confirm"
        />

        <Button
          onClick={async () => {
            await updateProposalMutation.mutateAsync({
              id,
              dto: {
                platformFeePercentage: newPlatfromFeePercentage,
              },
            });
            window.location.reload();
          }}
          loading={updateProposalMutation.isLoading}
        >
          {' '}
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
          <Text> {tresurers ? `${tresurers.join(', ')} \n` : null}</Text>
          <Text>
            {' '}
            {fundingGoal
              ? `Funding Goal is set too ${fundingGoal} \n`
              : 'No funding  Goal Set \n'}
          </Text>
          <Text>
            {' '}
            {deadline && deadline.length > 0
              ? `Date is ${new Date(deadline).toDateString()} \n`
              : `No Deadline Set \n`}
          </Text>
          <Text>
            {allowAboveFundingGoal
              ? 'This Portal can be funded above funding goal \n'
              : `This Portal can't be funded above funding goal \n`}
          </Text>
        </p>

        <p className="text-md text-gray-500 max-h-14 overflow-y-auto">
          <Text>{description}</Text>
        </p>

        <Group justify="space-evenly" mt="md" mb="xs">
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
              onChange={(event: { currentTarget: { value: SetStateAction<string> } }) => {
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
          {!disableButton && (
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
          )}
        </Group>
      </Card>
    </>
  );
}

export default PortalAdminCard;
