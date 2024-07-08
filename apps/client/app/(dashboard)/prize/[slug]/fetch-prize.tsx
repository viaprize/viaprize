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
      title: prize.title,
      description: prize.description,
      url: prize.slug,
      images: {
        width: 1200,
        height: 630,
        alt: prize.title,
        url: prize.images[0],
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: prize.title,
      description: prize.description.slice(0, 300),
      images: prize.images,
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

  return <PrizePageComponent prize={prize} submissions={submissions} />;
}
