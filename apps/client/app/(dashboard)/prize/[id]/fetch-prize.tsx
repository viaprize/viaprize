import PrizePageComponent from '@/components/Prize/prizepage/prizepage';
import { Api } from '@/lib/api';

export const dynamic = 'auto';
export const dynamicParams = true;
export const revalidate = 5;
export const fetchCache = 'auto';
export const preferredRegion = 'auto';
export const maxDuration = 5;

export default async function FetchPrize({ params }: { params: { id: string } }) {

  const prize = (await new Api().prizes.prizesDetail(params.id)).data;
  const submissions = (
    await new Api().prizes.submissionDetail2(
      params.id,
      {
        limit: 5,
        page: 1,
      },
    )
  ).data.data;
  return <PrizePageComponent prize={prize} submissions={submissions} />;
}
