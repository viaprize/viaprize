import ExploreCard from '@/components/ExplorePrize/explorePrize';
import { Api } from '@/lib/api';
import { calculateDeadline } from '@/lib/utils';
import { formatEther } from 'viem';
export default async function FetchPrizes() {
  const prizes = (
    await new Api().prizes.prizesList({
      limit: 10,
      page: 1,
    })
  ).data.data;

  return (
    <>
      {prizes.map((prize) => {
        const deadlineString = calculateDeadline(prize.created_at, prize.submissionTime);
        return (
          <ExploreCard
            description={prize.description}
            imageUrl={prize.images[0]}
            deadlinetimereamining={deadlineString.remainingTime}
            deadline={deadlineString.dateString}
            money={formatEther(BigInt(prize.balance))}
            profileName={prize.user ? prize.user.name : ''}
            title={prize.title}
            key={prize.id}
            id={prize.id}
            skills={prize.priorities || prize.proficiencies}
          />
        );
      })}
    </>
  );
}
