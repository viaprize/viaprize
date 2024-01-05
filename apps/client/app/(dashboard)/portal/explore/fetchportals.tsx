import { Api } from '@/lib/api';
import { formatEther } from 'viem';
import PortalCard from './portal-card';

export default async function FetchPortals() {
  const portals = (
    await new Api().portals.portalsList({
      limit: 20,
      page: 1,
    })
  ).data.data;

  return (
    <>
      {portals.map((portal) => {
        return (
          <PortalCard
            description={portal.description}
            imageUrl={portal.images[0]}
            amountRaised={formatEther(BigInt(portal.totalRewards ?? 0))}
            authorName={portal.user.name}
            totalContributors="0"
            isActive={portal.isActive ?? false}
            title={portal.title}
            key={portal.id}
            typeOfPortal={portal.sendImmediately ? 'Pass-through' : 'All-or-nothing'}
            id={portal.id}
            fundingGoal={portal.fundingGoal ?? 0}
            deadline={portal.deadline}
          />
        );
      })}
    </>
  );
}
