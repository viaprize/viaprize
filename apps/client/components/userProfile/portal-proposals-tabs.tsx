import SkeletonLoad from '@/components/custom/skeleton-load-explore';
import type { PortalProposals } from '@/lib/api';
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
import {
  prepareWritePassThroughV2Factory,
  writePassThroughV2Factory,
} from '@/lib/smartContract';
import type { ProposalStatus } from '@/lib/types';
import { Button, Text, Title } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { waitForTransaction } from '@wagmi/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useQuery } from 'wagmi';
import ProposalExploreCard from '../Prize/ExplorePrize/proposalExploreCard';
import Shell from '../custom/shell';
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
  const { getProposalsOfUser: getPortalProposalsOfUser, deleteProposal } =
    usePortalProposal();

  const {
    data,
    isSuccess,
    isLoading,
    refetch: refetchPortals,
  } = useQuery([`getPortalProposals${params.id}`, undefined], () => {
    return getPortalProposalsOfUser({ limit: 10, page: 1 }, params.id);
  });

  const { mutateAsync: DeletePortalProposal, isLoading: deletingProposal } =
    useMutation(deleteProposal);

  if (isLoading) return <SkeletonLoad gridedSkeleton numberOfCards={3} />;

  if (data?.length === 0)
    return (
      <Shell>
        <Title className="text-2xl">You dont have any Portal Proposals</Title>
        <Button
          onClick={() => {
            router.push('/portal/create');
          }}
          className="mt-4"
        >
          Create Portal Proposal
        </Button>
      </Shell>
    );

  return (
    <div className="p-6 w-full">
      <div className="grid  md:grid-cols-3 grid-cols-1 gap-4">
        {isSuccess
          ? data?.map((item) => (
              <ProposalExploreCard
                onDeleted={async () => {
                  toast.loading('Deleting Proposal...');
                  await DeletePortalProposal(item.id);
                  await refetchPortals();
                  toast.dismiss();
                  toast.success('Deleted Proposal');
                }}
                status={getProposalStatus(item)}
                key={item.id}
                imageUrl={item.images[0]}
                description={item.description}
                onStatusClick={async (status) => {
                  switch (status) {
                    case 'pending': {
                      router.push(`/portal/proposal/edit/${item.id}`);
                      break;
                    }
                    case 'approved': {
                      const firstLoadingToast = toast.loading(
                        'Transaction Waiting To Be approved',
                        {
                          dismissible: false,
                        },
                      );
                      const finalFundingGoal = parseEther(
                        (item.fundingGoal ?? '0').toString(),
                      );
                      const request = await prepareWritePassThroughV2Factory({
                        functionName: 'createPortal',
                        args: [
                          BigInt(new Date().getTime()),
                          item.treasurers[0] as `0x${string}`,
                          ADMINS,
                          BigInt(item.platformFeePercentage),
                          USDC,
                          USDC_BRIDGE,
                          WETH,
                          SWAP_ROUTER,
                          USDC_TO_USDCE_POOL,
                          USDC_TO_ETH_POOL,
                          ETH_PRICE,
                        ],
                        address: '0xdCcF514720AABBfFF6bed7a7Db4b498677EfD3D3',
                      });
                      const transaction = await writePassThroughV2Factory(request);
                      // const out = await writeViaPrizeFactory(request);
                      toast.dismiss(firstLoadingToast);
                      const secondToast = toast.loading(
                        'Waiting for transaction Confirmation...',
                        {
                          dismissible: false,
                        },
                      );
                      const waitForTransactionOut = await waitForTransaction({
                        hash: transaction.hash,
                        confirmations: 1,
                      });
                      const portalAddress = `0x${waitForTransactionOut.logs[0].topics[1]?.slice(
                        -40,
                      )}`;
                      await createPortal({
                        address: portalAddress,
                        proposal_id: item.id,
                      });
                      toast.dismiss(secondToast);
                      toast.success(
                        <div className="flex items-center ">
                          <IconCircleCheck />{' '}
                          <Text fw="md" size="sm" className="ml-2">
                            {' '}
                            Portal Address
                          </Text>
                          <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://optimistic.etherscan.io/address/${portalAddress}`}
                          >
                            <Button
                              variant="transparent"
                              className="text-blue-400 underline"
                            >
                              See here
                            </Button>
                          </Link>
                        </div>,
                      );
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
