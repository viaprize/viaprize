import { Api } from '@/lib/api';
import { formatEther } from 'viem';
import AmountDonateCard from './amount-donate-card';
import ImageTitleHeroCard from './image-title-hero-card';
import PortalTabs from './portal-tabs';

export default async function CreatePortal({ params }: { params: { id: string } }) {
  const portal = (
    await new Api().portals.portalsDetail(params.id, {
      next: {
        revalidate: 10,
      },
    })
  ).data;

  console.log(portal);
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
          fundingGoal={portal.fundingGoal ?? 0}
          typeOfPortal={portal.sendImmediately ? 'GoFundMe' : 'KickStarter'}
          deadline={portal.deadline}
          isActive={portal.isActive ?? false}
          treasurers={portal.treasurers}
        />
      </div>
      <PortalTabs description={portal.description} />
    </div>
  );
}
