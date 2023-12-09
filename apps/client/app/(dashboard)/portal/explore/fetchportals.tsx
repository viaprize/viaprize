import { Api } from '@/lib/api';
import PortalCards from './portal-card';

export default async function FetchPortals() {
  const portal = (
    await new Api().portals.portalsList({
      limit: 10,
      page: 1,
    })
  ).data.data;
  return (
    <>
      {portal.map((portal) => {
        return (
          <PortalCards
            description={portal.description}
            imageUrl={portal.images[0]}
            amountRaised={portal.balance.toString()}
            authorName={portal.user.name}
            shareUrl=''
            totalContributors='0'
            title={portal.title}
            key={portal.id}
            id={portal.id}
          />
          
        );
      })}
    </>
  );
}
