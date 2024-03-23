import AboutHistory from '@/components/history/about-history';
import { FetchPrizesCsvId } from '@/components/history/fetch-histdetails-by-id';

export default async function FetchHistDetails({ params }: { params: { id: number } }) {
  const data = await FetchPrizesCsvId(params.id);

  return data ? (
    <AboutHistory
      title={data.PrizeName}
      imageUrl={data.Image}
      awarded={data.AwardedUSDe}
      comment={data.Comment}
      winnersAmount={data.WinnersAmount}
      worklink={data.WorkLink}
      status={data.WinnersAmount ? 'Won' : 'Refunded'}
      rawDescription={data.Description}
    />
  ) : (
    <div>No prize details found for the given ID.</div>
  );
}
