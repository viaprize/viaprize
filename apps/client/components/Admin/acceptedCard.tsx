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
import { IconCircleCheck } from '@tabler/icons-react';
import { waitForTransaction } from '@wagmi/core';
import Link from 'next/link';
import router from 'next/router';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { usePrize } from '../hooks/usePrize';
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
  submissionTime: number;
  judges?: string[];
}

function AdminAcceptedCard({
  id,
  images,
  admins,
  description,
  submission,
  title,
  user,
  voting,
  submissionTime,
  judges,
  platfromFeePercentage,
  proposerFeePercentage,
}: AdminCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const currentTimestamp = useRef(Date.now());

  const { createPrize } = usePrize();

  const deployPrize = async () => {
    const firstLoadingToast = toast.loading('Transaction Waiting To Be approved', {
      dismissible: false,
    });
    let out;
    if (judges && judges.length > 0) {
      // const requestJudges = await prepareWritePrizeJudgesFactory({
      //   functionName: 'createViaPrizeJudges',
      //   args: [
      //     admins as `0x${string}`[],
      //     [
      //       '0x850a146D7478dAAa98Fc26Fd85e6A24e50846A9d',
      //       '0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F',
      //       '0x598B7Cd048e97E1796784d92D06910F359dA5913',
      //     ] as `0x${string}`[],
      //     judges as `0x${string}`[],
      //     BigInt(platfromFeePercentage),
      //     BigInt(proposerFeePercentage),
      //     '0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c' as `0x${string}`,
      //     BigInt(submissionTime),
      //     BigInt(currentTimestamp.current),
      //   ],
      // });
      // out = await writePrizeJudgesFactory(requestJudges);
      toast.error("Judges aren't supported yet");
      console.log(out, 'outJudges');
    } else {
      console.log({ admins });
      const requestJudges = await prepareWritePrizeFactoryV2({
        functionName: 'createViaPrize',
        args: [
          BigInt(currentTimestamp.current),
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
      out = await writePrizeFactoryV2(requestJudges).catch((_) => {
        toast.error('Transaction Failed');
        toast.dismiss(firstLoadingToast);
      });
      console.log(out, 'out');
    }
    if (!out) return toast.error('Transaction Failed');
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
    toast.success(
      <div className="flex items-center ">
        <IconCircleCheck />{' '}
        <Text fw="md" size="sm" className="ml-2">
          {' '}
          Prize Address
        </Text>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={`https://optimistic.etherscan.io/address/${prizeAddress}`}
        >
          <Button variant="transparent" className="text-blue-400 underline">
            See here
          </Button>
        </Link>
      </div>,
    );
    toast.loading('Redirecting Please Wait');
    await router.push('/prize/explore');
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
          <Button onClick={deployPrize}>Deploy</Button>
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
}

export default AdminAcceptedCard;
