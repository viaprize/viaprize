import PortalCard from './portal-card';
import { Api } from '@/lib/api';

export default async function FetchPortals() {
  const portals = (
    await new Api().portals.portalsList({
      limit: 10,
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
            amountRaised={portal.balance.toString()}
            authorName={portal.user.name}
            totalContributors="0"
            title={portal.title}
            key={portal.id}
            id={portal.id}
          />
        );
      })}
    </>
  );
}
