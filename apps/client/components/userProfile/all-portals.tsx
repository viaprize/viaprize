import { backendApi } from '@/lib/backend';
import { Button, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { formatEther } from 'viem';
import Shell from '../custom/shell';
import SkeletonLoad from '../custom/skeleton-load-explore';
import getCryptoToUsd from '../hooks/server-actions/CryptotoUsd';
import PortalCard from '../portals/portal-card';

export default function AllPortals({ params }: { params: { id: string } }) {
  const { isLoading, data } = useQuery(['getPortalsOfUser', undefined], async () => {
    return (await backendApi()).portals.userDetail(params.id);
  });

  const { data: final } = useQuery(['cryptoToUsd', undefined], async () =>
    getCryptoToUsd(),
  );
  const router = useRouter();

  if (isLoading) return <SkeletonLoad numberOfCards={3} gridedSkeleton />;

  if (!data || data.data.length === 0)
    return (
      <Shell>
        <Text>You dont have any Portals</Text>
        <Button
          onClick={() => {
            router.push('/portal/create');
          }}
          className="mt-4"
        >
          Create Portal
        </Button>
      </Shell>
    );
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
      {data.data.map((portal) => {
        return (
          <PortalCard
            ethToUsd={final?.ethereum.usd ?? 2100}
            description={portal.description}
            imageUrl={portal.images[0]}
            amountRaised={formatEther(BigInt(portal.totalFunds ?? 0))}
            authorName={portal.user.name}
            totalContributors="0"
            isActive={portal.isActive ?? false}
            title={portal.title}
            key={portal.id}
            typeOfPortal={portal.sendImmediately ? 'Pass-through' : 'All-or-nothing'}
            id={portal.id}
            fundingGoalWithPlatformFee={parseFloat(portal.fundingGoal ?? '0')}
            deadline={portal.deadline}
            tags={portal.tags}
          />
        );
      })}
    </div>
  );
}
