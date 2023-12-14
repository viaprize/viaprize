import ExploreCard from '@/components/ExplorePrize/explorePrize';
import { Api } from '@/lib/api';
import { formatEther } from 'viem';

export default async function FetchPrizes() {
  const prizes = (
    await new Api().prizes.prizesList(
      {
        limit: 10,
        page: 1,
      },
      {
        next: {
          revalidate: 5,
        },
      },
    )
  ).data.data;

  return (
    <>
      {prizes.map((prize) => {
        return (
          <ExploreCard
            description={prize.description}
            imageUrl={prize.images[0]}
            createdAt={prize.created_at}
            submissionDays={prize.submissionTime}
            money={formatEther(BigInt(prize.balance))}
            profileName={prize.user.name}
            title={prize.title}
            key={prize.id}
            id={prize.id}
            skills={prize.proficiencies}
          />
        );
      })}
    </>
  );
}
