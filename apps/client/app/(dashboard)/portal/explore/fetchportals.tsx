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

  const final: { ethereum: { usd: number } } = await (
    await fetch(`https://api-prod.pactsmith.com/api/price/usd_to_eth`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();
  console.log({ portals });
  return (
    <>
      {portals.map((portal) => {
        return (
          <PortalCard
            ethToUsd={final.ethereum.usd}
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
            fundingGoal={portal.fundingGoal ?? 0}
            deadline={portal.deadline}
          />
        );
      })}
    </>
  );
}
