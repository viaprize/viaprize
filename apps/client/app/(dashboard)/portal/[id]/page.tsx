import CommentSection from '@/components/comment/comment-section';
import { Api } from '@/lib/api';
import { formatEther } from 'viem';
import AmountDonateCard from './amount-donate-card';
import ImageTitleHeroCard from './image-title-hero-card';
import PortalTabs from './portal-tabs';

export default async function Portal({ params }: { params: { id: string } }) {
  const portal = (
    await new Api().portals.portalsDetail(params.id, {
      next: {
        revalidate: 5,
      },
    })
  ).data;

  return (
    <div className="my-10 px-3 sm:px-6 md:px-14 lg:px-20">
      <div className="w-full lg:flex gap-4 justify-between">
        <ImageTitleHeroCard
          name={portal.user.name}
          title={portal.title}
          img={portal.images[0]}
        />
        <AmountDonateCard
          amountRaised={formatEther(BigInt(portal.totalFunds ?? 0))}
          recipientAddress={portal.contract_address}
          totalContributors={formatEther(BigInt(portal.totalFunds ?? 0))}
          contractAddress={portal.contract_address}
          fundingGoalWithPlatformFee={parseFloat(
            portal.fundingGoalWithPlatformFee ?? '0',
          )}
           id={portal.id}


          typeOfPortal={portal.sendImmediately ? 'Pass-through' : 'All-or-nothing'}
          deadline={portal.deadline}
          isActive={portal.isActive ?? false}
          treasurers={portal.treasurers}
          sendImmediately={portal.sendImmediately}
        />
      </div>
      <PortalTabs
        description={portal.description}
        contributors={portal.contributors}
        updates={portal.updates ?? []}
        owner={portal.user.username}
        param={params.id}

      />
      {/* @ts-expect-error Server Component */}
      <CommentSection portalId={params.id} />
    </div>
  );
}
