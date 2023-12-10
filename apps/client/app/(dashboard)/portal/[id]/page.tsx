import { Api } from '@/lib/api';
import AmountDonateCard from './amount-donate-card';
import ImageTitleHeroCard from './image-title-hero-card';
import PortalTabs from './portal-tabs';

export default async function CreatePortal({ params }: { params: { id: string } }) {
  const portal = (await new Api().portals.portalsDetail(params.id)).data;
  return (
    <div className="my-10 px-3 sm:px-6 md:px-14 lg:px-20">
      <div className="w-full lg:flex gap-4 justify-between">
        <ImageTitleHeroCard
          name={portal.user.name}
          title={portal.title}
          img={portal.images[0]}
        />
        <AmountDonateCard
          amountRaised={portal.balance.toString()}
          recipientAddress={portal.contract_address}
          totalContributors="0"
          contractAddress={portal.contract_address}
        />
      </div>
      <PortalTabs description={portal.description} />
    </div>
  );
}
