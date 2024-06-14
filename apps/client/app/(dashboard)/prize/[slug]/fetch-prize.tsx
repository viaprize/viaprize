import PrizePageComponent from '@/components/Prize/prizepage/prizepage';
import { Api } from '@/lib/api';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const dynamic = 'auto';
export const dynamicParams = true;
export const revalidate = 5;
export const fetchCache = 'auto';
export const preferredRegion = 'auto';
export const maxDuration = 5;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const prize = (
    await new Api().prizes.prizesDetail(params.slug, {
      next: {
        revalidate: 0,
      },
    })
  ).data;

  return {
    title: prize.title,
    description: prize.description,
    metadataBase: new URL('https://viaprize.org/'),
    openGraph: {
      images: {
        url: prize.images[0],
      },
    },
  };
}

export default async function FetchPrize({ params }: { params: { slug: string } }) {
  if (params.slug.includes('-')) {
    const slug = (await new Api().prizes.slugDetail(params.slug)).data;
    if (slug) {
      return redirect(`/prize/${slug.slug}`);
    }
  }

  const prize = (
    await new Api().prizes.prizesDetail(params.slug, {
      next: {
        revalidate: 0,
        tags: [params.slug],
      },
    })
  ).data;

  const submissions = (
    await new Api().prizes.submissionDetail(
      params.slug,
      {
        limit: 5,
        page: 1,
      },
      {
        next: {
          revalidate: 0,
          tags: [params.slug],
        },
      },
    )
  ).data.data;
  console.log(submissions, 'sub');

  return <PrizePageComponent prize={prize} submissions={submissions} />;
}
