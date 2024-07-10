import { Api } from '@/lib/api';
import { campaignSearchParamsSchema } from '@/lib/params';
import type { SearchParams } from '@/lib/types';
import PortalCard from '../../../../components/portals/portal-card';

const parseCategories = (value: string | undefined): string[] | undefined => {
  if (value) {
    return value.split('.').map((item) => item.replace(/\+/g, ' '));
  }
  return undefined;
};

export default async function FetchPortals({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (searchParams.categories) {
    searchParams.categories = parseCategories(searchParams.categories as string);
  }

  const { search, sort, categories, page } =
    campaignSearchParamsSchema.parse(searchParams);

  console.log(searchParams, 'searchParams.categories');

  // console.log(search, sort);

  const portals = (
    await new Api().portals.portalsList(
      {
        limit: 12,
        page,
        tags: categories,
        search,
        sort,
      },
      {
        next: {
          revalidate: 0,
        },
      },
    )
  ).data.data;

  // console.log(portals);

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
            isIframe={false}
            slug={portal.slug}
          />
        );
      })}
      {portals.length === 0 && (
        <>
          <p />
          <div className="w-full flex justify-center my-4 h-full">
            <p>No Fundraisers found</p>
          </div>
        </>
      )}
    </>
  );
}
