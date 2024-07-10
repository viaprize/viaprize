'use client';
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import PortalCard from '@/components/portals/portal-card';
import { Api } from '@/lib/api';

export default async function PortalEmbed({ params }: { params: { id: string } }) {
  const portal = (
    await new Api().portals.portalsDetail(params.id, {
      next: {
        revalidate: 5,
      },
    })
  ).data;

  return (
    <div className="portal-embed-container">
      {portal ? (
        <PortalCard
          description={portal.description}
          imageUrl={portal.images[0]}
          amountRaised={((portal.totalFunds ?? 0) / 1_000_000).toString()}
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
          isIframe={true}
          slug={portal.slug}
        />
      ) : null}
    </div>
  );
}
