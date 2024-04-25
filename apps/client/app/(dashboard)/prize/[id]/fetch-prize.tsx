import PrizePageComponent from '@/components/Prize/prizepage/prizepage';
import { Api } from '@/lib/api';
import type { Metadata } from 'next';

export const dynamic = 'auto';
export const dynamicParams = true;
export const revalidate = 5;
export const fetchCache = 'auto';
export const preferredRegion = 'auto';
export const maxDuration = 5;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const prize = (
    await new Api().prizes.prizesDetail(params.id, {
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

export default async function FetchPrize({ params }: { params: { id: string } }) {
  const prize = (
    await new Api().prizes.prizesDetail(params.id, {
      next: {
        revalidate: 0,
      },
    })
  ).data;

  const submissions = (
    await new Api().prizes.submissionDetail2(params.id, {
      limit: 5,
      page: 1,
    })
  ).data.data;
  console.log(submissions, 'sub');

  return <PrizePageComponent prize={prize} submissions={submissions} />;
}
