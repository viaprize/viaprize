import HistoryCard from '@/components/history/history-card';
import { FetchPrizesCsv } from './fetch-csv';

export default async function HistoryPage() {
  const data = await FetchPrizesCsv();
  return (
    <section className="p-2 pb-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.reverse().map((prize) => {
          // Reverse the data array
          if (
            (prize.Awarded &&
              // prize.WonRefunded &&
              prize.PrizeName) ||
            prize.DatePosted ||
            prize.AwardedUSDe ||
            prize.WinnersAmount // Changed this line
          ) {
            const status = prize.WinnersAmount ? 'Won' : 'Refunded'; // Adjusted status based on WinnersAmount existence
            return (
              <HistoryCard
                key={prize.Id}
                imageUrl={prize.Image}
                id={prize.Id}
                status={status} // Passed the adjusted status here
                datePosted={prize.DatePosted}
                title={prize.PrizeName}
                description={prize.SimpleDescription}
                awarded={`${prize.AwardedUSDe} USD`}
                category={prize.Category}
              />
            );
          }
          return null;
        })}
      </div>
    </section>
  );
}
