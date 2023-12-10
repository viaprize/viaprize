import PrizePageComponent from '@/components/Prize/prizepage/prizepage';
import { Api } from '@/lib/api';

export default async function FetchPrize({ params }: { params: { id: string } }) {
  const prize = (await new Api().prizes.prizesDetail(params.id)).data;
  const submissions = (
    await new Api().prizes.submissionDetail2(params.id, {
      limit: 5,
      page: 1,
    })
  ).data.data;
  return (
    <>
      <PrizePageComponent prize={prize} submissions={submissions} />
    </>
  );
}
