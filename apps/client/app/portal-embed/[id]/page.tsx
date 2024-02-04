/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useRouter } from 'next/router';
import { Api } from '@/lib/api';
import type { SearchParams } from '@/lib/types';
import { formatEther } from 'viem';
import PortalCard from '@/components/portals/portal-card';

async function fetchPortalData(id: string) {
  //   try {
  //     const api = new Api();
  //     const response = await api.get(`/portals/${id}`);
  //     if (response.status === 200) {
  //       const portalData = await response.json();
  //       return portalData;
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error('Error fetching portal data:', error);
  //     return null;
  //   }
}

export default async function PortalEmbed({ params }: { params: { id: string } }) {
  const portal = (
    await new Api().portals.portalsDetail(params.id, {
      next: {
        revalidate: 0,
      },
    })
  ).data;

  const final: { ethereum: { usd: number } } = await (
    await fetch(`https://api-prod.pactsmith.com/api/price/usd_to_eth`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();

  return (
    <div className="portal-embed-container">
      {portal ? (
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
          fundingGoalWithPlatformFee={parseFloat(portal.fundingGoal ?? '0')}
          deadline={portal.deadline}
          tags={portal.tags}
        />
      ) : null}
    </div>
  );
}
