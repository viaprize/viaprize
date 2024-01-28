import { User } from '@/lib/api';
import {
  prepareWritePrizeFactory,
  prepareWritePrizeJudgesFactory,
  writePrizeFactory,
  writePrizeJudgesFactory,
} from '@/lib/smartContract';
import { Badge, Button, Card, Group, Image, Modal, Text } from '@mantine/core';
import { waitForTransaction } from '@wagmi/core';
import router from 'next/router';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
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
  isAccepted?: boolean;
  submission_time: number;
  judges?: string[];
}

const AdminAcceptedCard: React.FC<AdminCardProps> = ({
  id,
  images,
  admins,
  description,
  submission,
  title,
  user,
  voting,
  submission_time,
  judges,
  platfromFeePercentage,
  proposerFeePercentage,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const currentTimestamp = useRef(Date.now());

  const deployPrize = async () => {
    const firstLoadingToast = toast.loading('Transaction Waiting To Be approved', {
      delete: false,
      dismissible: false,
    });
    let out;
    if (judges && judges.length > 0) {
      const requestJudges = await prepareWritePrizeJudgesFactory({
        functionName: 'createViaPrizeJudges',
        args: [
          admins as `0x${string}`[],
          [
            '0x850a146D7478dAAa98Fc26Fd85e6A24e50846A9d',
            '0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F',
            '0x598B7Cd048e97E1796784d92D06910F359dA5913',
          ] as `0x${string}`[],
          judges as `0x${string}`[],
          BigInt(platfromFeePercentage),
          BigInt(proposerFeePercentage),
          '0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c' as `0x${string}`,
          BigInt(submission_time),
          BigInt(currentTimestamp.current),
        ],
      });
      out = await writePrizeJudgesFactory(requestJudges);
      console.log(out, 'outJudges');
    } else {
      const requestJudges = await prepareWritePrizeFactory({
        functionName: 'createViaPrize',
        args: [
          admins as `0x${string}`[],
          [
            '0x850a146D7478dAAa98Fc26Fd85e6A24e50846A9d',
            '0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F',
            '0x598B7Cd048e97E1796784d92D06910F359dA5913',
          ] as `0x${string}`[],
          BigInt(platfromFeePercentage),
          BigInt(proposerFeePercentage),
          '0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c' as `0x${string}`,
          BigInt(submission_time),
          BigInt(currentTimestamp.current),
        ],
      });
      out = await writePrizeFactory(requestJudges);
      console.log(out, 'out');
    }
    const waitForTransactionOut = await waitForTransaction({
      hash: out.hash,
      confirmations: 1,
    });
    console.log(waitForTransactionOut.logs[0].topics[2]);
    const prizeAddress = `0x${waitForTransactionOut.logs[0].topics[2]?.slice(-40)}`;
    console.log(prizeAddress, 'prizeAddress');
    const prize = await createPrize({
      address: prizeAddress,
      proposal_id: id,
    });
    toast.dismiss(firstLoadingToast);
    console.log(prize, 'prize');
    toast.success(`Prize Address ${prizeAddress} `);
    toast.loading('Redirecting Please Wait');
    router.push('/prize/explore');
    toast.success('Redirected to Prize Explore Page');
  };
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
function createPrize(arg0: { address: string; proposal_id: any }) {
  throw new Error('Function not implemented.');
}
