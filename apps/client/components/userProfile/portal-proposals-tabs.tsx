import SkeletonLoad from '@/components/custom/skeleton-load-explore';
import type { PortalProposals } from '@/lib/api';
import { prepareWritePortalFactory, writePortalFactory } from '@/lib/smartContract';
import type { ProposalStatus } from '@/lib/types';
import { Text } from '@mantine/core';
import { waitForTransaction } from '@wagmi/core';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useQuery } from 'wagmi';
import ProposalExploreCard from '../Prize/ExplorePrize/proposalExploreCard';
import { usePortal } from '../hooks/usePortal';
import usePortalProposal from '../hooks/usePortalProposal';

const getProposalStatus = (item: PortalProposals): ProposalStatus => {
  if (item.isApproved) {
    return 'approved';
  } else if (item.isRejected) {
    return `rejected`;
  }
  return 'pending';
};
export default function PortalProposalsTabs({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { createPortal } = usePortal();
  const { getProposalsOfUser: getPortalProposalsOfUser } = usePortalProposal();

  const { data, isSuccess, isLoading } = useQuery(
    ['getPortalProposals', undefined],
    () => {
      return getPortalProposalsOfUser({ limit: 10, page: 1 }, params.id);
    },
  );

  if (isLoading) return <SkeletonLoad numberOfCards={3} />;

  return (
    <div className="p-6 w-full">
      <div className="grid  md:grid-cols-3 grid-cols-1 gap-4">
        {isSuccess
          ? data?.map((item) => (
              <ProposalExploreCard
                status={getProposalStatus(item)}
                key={item.id}
                imageUrl={item.images[0]}
                description={item.description}
                onStatusClick={async (status) => {
                  console.log({ status }, 'status');
                  switch (status) {
                    case 'pending': {
                      router.push(`/portal/proposal/edit/${item.id}`);
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

                      console.log('approved');
                      // console.log(
                      //     [
                      //         item?.admins as `0x${string}`[],
                      //         [
                      //             '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
                      //             '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
                      //             '0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F',
                      //         ] as `0x${string}`[],
                      //         BigInt(10),
                      //         BigInt(10),
                      //         '0x62e9a8374AE3cdDD0DA7019721CcB091Fed927aE' as `0x${string}`,
                      //     ],
                      //     'args',
                      // );
                      console.log(item, 'item');

                      const finalFundingGoal = parseEther(
                        (item.fundingGoal ?? '0').toString(),
                      );
                      console.log([
                        item.treasurers as `0x${string}`[],
                        finalFundingGoal,
                        BigInt(Math.floor(new Date(item.deadline).getTime() / 1000) ?? 0),
                        item.allowDonationAboveThreshold,
                        BigInt(item.platformFeePercentage),
                        item.sendImmediately,
                      ]);
                      const request = await prepareWritePortalFactory({
                        functionName: 'createPortal',
                        args: [
                          item.treasurers as `0x${string}`[],
                          [
                            '0x850a146D7478dAAa98Fc26Fd85e6A24e50846A9d',
                            '0xd9ee3059F3d85faD72aDe7f2BbD267E73FA08D7F',
                            '0x598B7Cd048e97E1796784d92D06910F359dA5913',
                          ] as `0x${string}`[],
                          finalFundingGoal,
                          BigInt(
                            Math.floor(new Date(item.deadline).getTime() / 1000) ?? 0,
                          ),
                          item.allowDonationAboveThreshold,
                          BigInt(item.platformFeePercentage),
                          item.sendImmediately,
                        ],
                      });
                      const transaction = await writePortalFactory(request);
                      // const out = await writeViaPrizeFactory(request);
                      toast.dismiss(firstLoadingToast);
                      const secondToast = toast.loading(
                        'Waiting for transaction Confirmation...',
                        {
                          dismissible: false,
                          delete: false,
                        },
                      );
                      console.log(transaction, 'out');
                      const waitForTransactionOut = await waitForTransaction({
                        hash: transaction.hash,
                        confirmations: 1,
                      });
                      console.log(waitForTransactionOut.logs[0].topics[1]);
                      const portalAddress = `0x${waitForTransactionOut.logs[0].topics[1]?.slice(
                        -40,
                      )}`;
                      console.log(portalAddress, 'portalAddress');
                      const portal = await createPortal({
                        address: portalAddress,
                        proposal_id: item.id,
                      });
                      toast.dismiss(secondToast);
                      console.log(portal, 'portal');
                      toast.success(`portal Address ${portalAddress} `);
                      toast.loading('Redirecting Please Wait');
                      router.push('/portal/explore');
                      toast.success('Redirected to portal Explore Page');
                      break;
                    }
                    case 'rejected': {
                      router.push(`/portal/proposal/edit/${item.id}`);
                      break;
                    }
                    default:
                      break;
                  }
                }}
                title={item.title}
                rejectedReason={item.rejectionComment}
              />
            ))
          : null}
        {isSuccess && data?.length === 0 ? <Text>No Proposals</Text> : null}
      </div>
    </div>
  );
}
