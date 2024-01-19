import type { User } from '@/lib/api';
import { prepareWritePortalFactory, writePortalFactory } from '@/lib/smartContract';
import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  Modal,
  NumberInput,
  Text,
  Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { waitForTransaction } from '@wagmi/core';
import type { SetStateAction } from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useMutation } from 'wagmi';
import { usePortal } from '../hooks/usePortal';
import usePortalProposal from '../hooks/usePortalProposal';

interface AdminCardProps {
  images: string[];
  id: string;
  user: User;
  title: string;
  description: string;
  tresurers: string[];
  fundingGoal?: string;
  deadline: string;
  allowAboveFundingGoal: boolean;
  portalAccepted?: boolean;
  platfromFeePercentage: number;
  fundingGoalWithPlatfromFeePercentage?: string;
  sendImmediately: boolean;
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
  fundingGoalWithPlatfromFeePercentage,
  sendImmediately,
  portalAccepted = false,
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
  const { createPortal } = usePortal();

  const portalDeploy = async () => {
    try {
      const firstLoadingToast = toast.loading('Transaction Waiting To Be approved', {
        delete: false,
        dismissible: false,
      });
      const finalFundingGoal = parseEther((fundingGoal ?? '0').toString());
      const request = await prepareWritePortalFactory({
        functionName: 'createPortal',
        args: [
          tresurers as `0x${string}`[],
          [
            '0x850a146D7478dAAa98Fc26Fd85e6A24e50846A9d',
            '0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F',
            '0x598B7Cd048e97E1796784d92D06910F359dA5913',
          ] as `0x${string}`[],
          finalFundingGoal,
          BigInt(Math.floor(new Date(deadline).getTime() / 1000) ?? 0),
          allowAboveFundingGoal,
          BigInt(platfromFeePercentage),
          sendImmediately,
        ],
      });
      const transaction = await writePortalFactory(request);
      toast.dismiss(firstLoadingToast);
      const secondToast = toast.loading(
        'Waiting for transaction Confirmation...DO NOT CLOSE WINDOW',
        {
          dismissible: false,
          delete: false,
        },
      );
      const waitForTransactionOut = await waitForTransaction({
        hash: transaction.hash,
        confirmations: 1,
      });
      const portalAddress = `0x${waitForTransactionOut.logs[0].topics[1]?.slice(-40)}`;
      const portal = await createPortal({
        address: portalAddress,
        proposal_id: id,
      });

      toast.success(`portal Address ${portalAddress} `);
      window.location.reload();
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /* eslint-disable */
      toast.error(e.message);
    }
  };

  const fundingGoalWithNewPlatformFees = useMemo(() => {
    console.log(fundingGoal, 'this is the funding goal');
    console.log(typeof fundingGoal, 'this is the type of funding goal');
    let fundingGoalNumber = parseFloat(fundingGoal ?? '0');

    return parseFloat(
      (
        fundingGoalNumber +
        fundingGoalNumber * (newPlatfromFeePercentage / 100)
      ).toPrecision(4),
    );
  }, [newPlatfromFeePercentage]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Update Fee Percentage" centered>
        <NumberInput
          value={newPlatfromFeePercentage}
          label={`${platfromFeePercentage} % is the Current Platform Fee for this proposal`}
          allowDecimal={false}
          allowNegative={false}
          onChange={(event) => {
            if (parseInt(event.toString()) > 100) {
              setnewPlatfromFeePercentage(100);
              return;
            }
            if (event.toString() === '') {
              setnewPlatfromFeePercentage(platfromFeePercentage);
              return;
            }
            setnewPlatfromFeePercentage(parseInt(event.toString()));
          }}
          placeholder="Enter in %"
          description={`This will change funding goal with platform fees to to ${fundingGoalWithNewPlatformFees} eth`}
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
            {fundingGoalWithPlatfromFeePercentage
              ? `Funding Goal with platform fees is ${fundingGoalWithPlatfromFeePercentage} \n`
              : `No funding  Goal Set \n`}
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
          {!portalAccepted ? (
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
          ) : (
            <Button onClick={portalDeploy}>Deploy</Button>
          )}
        </Group>
      </Card>
    </>
  );
}

export default PortalAdminCard;
