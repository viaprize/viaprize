import CommentSection from '@/components/comment/comment-section';
import { Api } from '@/lib/api';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AmountDonateCard from './amount-donate-card';
import ImageTitleHeroCard from './image-title-hero-card';
import PortalTabs from './portal-tabs';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const portal = (
    await new Api().portals.portalsDetail(params.slug, {
      next: {
        revalidate: 5,
      },
    })
  ).data;
  return {
    title: portal.title,
    description: portal.description,
    metadataBase: new URL('https://viaprize.org/'),
    openGraph: {
      images: {
        url: portal.images[0],
      },
    },
  };
}

export default async function CreatePortal({ params }: { params: { slug: string } }) {
  if (params.slug.includes('-')) {
    const slug = (await new Api().portals.slugDetail(params.slug)).data;
    if (slug) {
      return redirect(`/portal/${slug.slug}`);
    }
  }
  const portal = (
    await new Api().portals.portalsDetail(params.slug, {
      cache: 'no-store',
      next: {
        revalidate: 0,
        tags: [params.slug],
      },
    })
  ).data;

  console.log({ portal }, 'pokjhkkjrtal');
  return (
    <div className="my-10 px-3 sm:px-6 md:px-14 lg:px-20">
      <div className="w-full lg:flex gap-4 justify-between">
        <ImageTitleHeroCard
          name={portal.user.name}
          title={portal.title}
          img={portal.images[0]}
        />
        <AmountDonateCard
          amountRaised={((portal.totalFunds ?? 0) / 1_000_000).toString()}
          recipientAddress={portal.contract_address}
          totalContributors={BigInt(portal.totalFunds ?? 0).toString()}
          contractAddress={portal.contract_address}
          fundingGoalWithPlatformFee={parseFloat(
            portal.fundingGoalWithPlatformFee ?? '0',
          )}
          slug={portal.slug}
          id={portal.id}
          typeOfPortal={portal.sendImmediately ? 'Pass-through' : 'All-or-nothing'}
          deadline={portal.deadline}
          isActive={portal.isActive ?? false}
          treasurers={portal.treasurers}
          sendImmediately={portal.sendImmediately}
          image={portal.images[0]}
          title={portal.title}
        />
      </div>
      <PortalTabs
        description={portal.description}
        contributors={portal.contributors}
        updates={portal.updates ?? []}
        owner={portal.user.username}
        id={portal.id}
        slug={portal.slug}
      />
      {/* @ts-expect-error Server Component */}
      <CommentSection portalId={params.slug} />
    </div>
  );
}
