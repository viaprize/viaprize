import { PrizeProposals } from '@/lib/api';
import { ProposalStatus } from '@/lib/types';
import { Text } from '@mantine/core';
import ProposalExploreCard from '../ExplorePrize/proposalExploreCard';

export default function ProposalsTabs({
  data,
  isSuccess,
}: {
  data?: PrizeProposals[];
  isSuccess: boolean;
}) {
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
  return (
    <div className="p-6 w-full">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {isSuccess ? (
          data?.map((item) => (
            <ProposalExploreCard
              status={getProposalStatus(item)}
              key={item.id}
              imageUrl={item.images[0]}
              description={item.description}
              onStatusClick={(status) => {
                switch (status) {
                  case 'pending':
                    console.log('pending');
                    break;
                  case 'approved':
                    console.log('approved');
                    break;
                  case 'rejected':
                    console.log('rejected');
                    break;
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
