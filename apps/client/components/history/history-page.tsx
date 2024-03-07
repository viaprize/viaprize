import HistoryCard from '@/components/history/history-card';
import { FetchPrizesCsv } from './fetch-csv';

export default async function HistoryPage() {
  const data = await FetchPrizesCsv();
  return (
    <section className="p-1 pb-3">
      <h1>Web2 Prizes History</h1>
      <div className="grid grid-cols-3 gap-4">
        {data.map((prize) => {
          if (
            (prize.Awarded &&
              // prize.WonRefunded &&
              prize.PrizeName) ||
            prize.DatePosted ||
            prize.AwardedUSDe ||
            prize.WinnersAmount // Changed this line
          ) {
            const status = prize.WinnersAmount ? 'Won' : 'Not Won'; // Adjusted status based on WinnersAmount existence
            return (
              <HistoryCard
                imageUrl={prize.Image}
                key={prize.PrizeName}
                status={status} // Passed the adjusted status here
                datePosted={prize.DatePosted}
                title={prize.PrizeName}
                description={prize.WinnersAmount}
                awarded={`${prize.AwardedUSDe}USD`}
              />
            );
          }
          return null;
        })}
      </div>
    </section>
  );
}
