import type { PrizeProposals } from '@/lib/api';
import {
  prepareWritePrizeFactory,
  prepareWritePrizeJudgesFactory,
  writePrizeFactory,
  writePrizeJudgesFactory,
} from '@/lib/smartContract';
import type { ProposalStatus } from '@/lib/types';
import { Button, Text } from '@mantine/core';
import { waitForTransaction } from '@wagmi/core';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'sonner';
import ProposalExploreCard from '../Prize/ExplorePrize/proposalExploreCard';
import Shell from '../custom/shell';
import SkeletonLoad from '../custom/skeleton-load-explore';
import { usePrize } from '../hooks/usePrize';
import usePrizeProposal from '../hooks/usePrizeProposal';

export default function ProposalsTab({ params }: { params: { id: string } }) {
  const router = useRouter();
  const currentTimestamp = useRef(Date.now());
  const { createPrize } = usePrize();

  const { getProposalsOfUser, deleteProposal } = usePrizeProposal();
  const { data, isSuccess, isLoading } = useQuery(['getProposalsOfUser'], () => {
    return getProposalsOfUser({ limit: 10, page: 1 }, params.id);
  });
  const getProposalStatus = (item: PrizeProposals): ProposalStatus => {
    if (data) {
      if (item.isApproved) {
        return 'approved';
      } else if (item.isRejected) {
        return `rejected`;
      }
      return 'pending';
    }
    return 'pending';
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const finalizeTransaction = (item: PrizeProposals) => {};

  if (isLoading) return <SkeletonLoad numberOfCards={3} gridedSkeleton />;

  if (data?.length === 0)
    return (
      <Shell>
        <Text>You dont have any Prize Proposals</Text>
        <Button
          onClick={() => {
            router.push('/prize/create');
          }}
          className="mt-4"
        >
          Create Prize
        </Button>
      </Shell>
    );

  return (
    <div className="p-6 w-full">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {isSuccess ? (
          data.map((item) => (
            <ProposalExploreCard
              onDeleted={() => {
                toast.promise(deleteProposal(item.id), {
                  loading: 'Deleting Proposal',
                  success: 'Proposal Deleted Successfully',
                  error: 'Error Deleting Proposal',
                });
              }}
              status={getProposalStatus(item)}
              key={item.id}
              imageUrl={item.images[0]}
              description={item.description}
              onStatusClick={async (status) => {
                console.log({ status }, 'status');
                switch (status) {
                  case 'pending': {
                    router.push(`/prize/proposal/edit/${item.id}`);
                    break;
                  }
                  case 'approved': {
                    const firstLoadingToast = toast.loading(
                      'Transaction Waiting To Be approved',
                      {
                        delete: false,
                        dismissible: false,
                      },
                    );
                    let out;
                    if (item.judges && item.judges.length > 0) {
                      const requestJudges = await prepareWritePrizeJudgesFactory({
                        functionName: 'createViaPrizeJudges',
                        args: [
                          item.admins as `0x${string}`[],
                          [
                            '0x850a146D7478dAAa98Fc26Fd85e6A24e50846A9d',
                            '0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F',
                            '0x598B7Cd048e97E1796784d92D06910F359dA5913',
                          ] as `0x${string}`[],
                          item.judges as `0x${string}`[],
                          BigInt(item.platformFeePercentage),
                          BigInt(item.proposerFeePercentage),
                          '0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c' as `0x${string}`,
                          BigInt(item.submission_time),
                          BigInt(currentTimestamp.current),
                        ],
                      });
                      out = await writePrizeJudgesFactory(requestJudges);
                      console.log(out, 'outJudges');
                    } else {
                      const requestJudges = await prepareWritePrizeFactory({
                        functionName: 'createViaPrize',
                        args: [
                          item.admins as `0x${string}`[],
                          [
                            '0x850a146D7478dAAa98Fc26Fd85e6A24e50846A9d',
                            '0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F',
                            '0x598B7Cd048e97E1796784d92D06910F359dA5913',
                          ] as `0x${string}`[],
                          BigInt(item.platformFeePercentage),
                          BigInt(item.proposerFeePercentage),
                          '0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c' as `0x${string}`,
                          BigInt(item.submission_time),
                          BigInt(currentTimestamp.current),
                        ],
                      });
                      out = await writePrizeFactory(requestJudges);
                      console.log(out, 'out');
                    }
                    // const request = await prepareWriteViaPrizeFactory({
                    //   functionName: 'createViaPrize',
                    //   args: [
                    //     item.admins as `0x${string}`[],
                    //     [
                    //       '0x850a146D7478dAAa98Fc26Fd85e6A24e50846A9d',
                    //       '0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F',
                    //     ] as `0x${string}`[],
                    //     BigInt(item.platformFeePercentage),
                    //     BigInt(item.proposerFeePercentage),
                    //     '0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c' as `0x${string}`,
                    //     BigInt(currentTimestamp.current),
                    //   ],
                    // });
                    // const out = await writeViaPrizeFactory(request);
                    // toast.dismiss(firstLoadingToast);

                    // console.log(out, 'out');
                    const waitForTransactionOut = await waitForTransaction({
                      hash: out.hash,
                      confirmations: 1,
                    });
                    console.log(waitForTransactionOut.logs[0].topics[2]);
                    const prizeAddress = `0x${waitForTransactionOut.logs[0].topics[2]?.slice(
                      -40,
                    )}`;
                    console.log(prizeAddress, 'prizeAddress');
                    const prize = await createPrize({
                      address: prizeAddress,
                      proposal_id: item.id,
                    });
                    toast.dismiss(firstLoadingToast);
                    console.log(prize, 'prize');
                    toast.success(
                      `Prize Address ${prizeAddress.slice(0, 4)}...${prizeAddress.slice(-4)}`,
                    );
                    toast.loading('Redirecting Please Wait');
                    router.push('/prize/explore');
                    toast.success('Redirected to Prize Explore Page');
                    break;
                  }
                  case 'rejected': {
                    console.log('rejected');
                    router.push(`/prize/proposal/edit/${item.id}`);

                    break;
                  }
                  default:
                    break;
                }
              }}
              title={item.title}
            />
          ))
        ) : (
          <Text>No Proposals</Text>
        )}
      </div>
    </div>
  );
}
