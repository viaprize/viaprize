/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import ExploreCard from '@/components/Prize/ExplorePrize/explorePrize';
import { FetchPrizesCsv } from '@/components/history/fetch-csv';
import HistoryCard from '@/components/history/history-card';
import { Api } from '@/lib/api';

export default async function FetchPrizes() {
  const prizes = (
    await new Api().prizes.prizesList(
      {
        limit: 20,
        page: 1,
      },
      {
        next: {
          revalidate: 0,
        },
      },
    )
  ).data.data;
  const usdToEth: { ethereum: { usd: number } } = await (
    await fetch(`https://api-prod.pactsmith.com/api/price/usd_to_eth`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();

  console.log(prizes[0], 'prizes');

  const data = await FetchPrizesCsv();

  return (
    <>
      {prizes.map((prize) => {
        return (
          <ExploreCard
            distributed={prize.distributed}
            description={prize.description}
            imageUrl={prize.images[0]}
            createdAt={prize.created_at}
            submissionMinutes={prize.submissionTime}
            usdAmount={(prize.balance / 1000000).toFixed(2)}
            profileName={prize.user.name}
            contestants={prize.contestants?.length || 0}
            title={prize.title}
            key={prize.id}
            id={prize.id}
            skills={prize.proficiencies}
            startingTimeBlockchain={prize.submission_time_blockchain}
            slug={prize.slug}
            startSubmissionDate={new Date(prize.startSubmissionDate)}
            startVotingDate={new Date(prize.startVotingDate)}
          />
        );
      })}

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
              imageUrl={prize.CardImage}
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
    </>
  );
}
