'use client';
import type { User } from '@/lib/api';
import {
  ADMINS,
  ETH_PRICE,
  SWAP_ROUTER,
  USDC,
  USDC_BRIDGE,
  USDC_TO_ETH_POOL,
  USDC_TO_USDCE_POOL,
  WETH,
} from '@/lib/constants';
import { prepareWritePrizeFactoryV2, writePrizeFactoryV2 } from '@/lib/smartContract';
import { Badge, Button, Card, Group, Image, Modal, Text } from '@mantine/core';
import { waitForTransaction } from '@wagmi/core';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { TransactionToast } from '../custom/transaction-toast';
import { usePrize } from '../hooks/usePrize';
import ViewDetails from './details';
('next/navigation');

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
  isAccepted?: boolean;
  startVotingDate: string;
  startSubmissionDate: string;
  judges?: string[];
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
  const remainingTime = endDate.getTime() - now.getTime();

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

function AdminAcceptedCard({
  id,
  images,
  admins,
  description,
  submission,
  title,
  user,
  voting,
  startSubmissionDate,
  startVotingDate,
  judges,
  platfromFeePercentage,
  proposerFeePercentage,
}: AdminCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const currentTimestamp = useRef(Date.now());

  const { createPrize } = usePrize();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const deployPrize = async () => {
    const firstLoadingToast = toast.loading('Transaction Waiting To Be approved', {
      dismissible: false,
    });
    setLoading(true);
    try {
      let out;
      if (judges && judges.length > 0) {
        throw new Error('Judges are not supported yet');
      } else {
        console.log({ admins });

        const requestJudges = await prepareWritePrizeFactoryV2({
          functionName: 'createViaPrize',
          args: [
            '0x',
            admins[0] as `0x${string}`,
            ADMINS,
            BigInt(platfromFeePercentage),
            BigInt(proposerFeePercentage),
            USDC,
            USDC_BRIDGE,
            SWAP_ROUTER,
            USDC_TO_USDCE_POOL,
            USDC_TO_ETH_POOL,
            ETH_PRICE,
            WETH,
          ],
        });
        console.log(requestJudges, 'requestJudges');
        out = await writePrizeFactoryV2(requestJudges);
        if (!out) throw new Error('Transaction Failed');

        console.log(out, 'out');

        const waitForTransactionOut = await waitForTransaction({
          hash: out.hash,
          confirmations: 1,
        });
        toast.dismiss(firstLoadingToast);
        console.log(waitForTransactionOut, 'waitForTransactionOut');
        console.log(waitForTransactionOut.logs[0].topics[2]);
        const prizeAddress = `0x${waitForTransactionOut.logs[0].topics[2]?.slice(-40)}`;
        console.log(prizeAddress, 'prizeAddress');
        const prize = await createPrize({
          address: prizeAddress,
          proposal_id: id,
        }).catch((c) => console.log(c));

        toast.success(<TransactionToast title="Deployment successful" hash={out.hash} />);
        // router.push('/prize/explore');

        router.push('/prize/explore');
      }
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
      toast.dismiss(firstLoadingToast);
    } finally {
      setLoading(false);
    }
  };

  const submissionTime = calculateRemainingTime(startSubmissionDate, submission);

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
            Time from submission start to deadline: {submissionTime.remainingDays} days{' '}
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
          <Button loading={loading} onClick={deployPrize}>
            Deploy
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
          startVotingDate={startVotingDate}
          startSubmissionDate={startSubmissionDate}
        />
      </Modal>
    </>
  );
}

export default AdminAcceptedCard;
