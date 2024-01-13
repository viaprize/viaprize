import { Api } from '@/lib/api';
import PortalCard from './portal-card';
import { campaignSearchParamsSchema } from '@/lib/params';
import { type SearchParams } from '@/lib/types';
import { formatEther } from 'viem';


export default async function FetchPortals(searchParams: SearchParams) {

    const { page, perPage } =
      campaignSearchParamsSchema.parse(searchParams);
    
    console.log(page, perPage);

  const portals = (
    await new Api().portals.portalsList(
      {
        limit: perPage,
        page,
      },
      {
        next: {
          revalidate: 0,
        },
      },
    )
  ).data.data;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- will check later
  const final: { ethereum: { usd: number } } = await (
    await fetch(`https://api-prod.pactsmith.com/api/price/usd_to_eth`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();

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
            tags={portal.tags}
          />
        );
      })}
    </>
  );
}
