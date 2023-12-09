import AmountDonateCard from './amount-donate-card';
import ImageTitleHeroCard from './image-title-hero-card';
import PortalTabs from './portal-tabs';

export default function CreatePortal() {
  return (
    <div className="my-10">
      <div className="w-full lg:flex gap-4 px-3 sm:px-6 md:px-14 lg:px-20 justify-between">
        <ImageTitleHeroCard />
        <AmountDonateCard />
      </div>

      <PortalTabs />
    </div>
  );
}
