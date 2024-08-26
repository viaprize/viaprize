import type { PrizeProposals } from '@/lib/api';
import type { ProposalStatus } from '@/lib/types';
import { Button, Text } from '@mantine/core';
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
                    toast.success('Check explore page');
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
