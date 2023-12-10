import { formatEther } from 'viem';
import ExploreCard from '@/components/ExplorePrize/explorePrize';
import { Api } from '@/lib/api';

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
        return (
          <ExploreCard
            description={prize.description}
            imageUrl={prize.images[0]}
            deadline=""
            money={formatEther(BigInt(prize.balance))}
            profileName={prize.user ? prize.user.name : ''}
            title={prize.title}
            key={prize.id}
            id={prize.id}
          />
        );
      })}
    </>
  );
}
