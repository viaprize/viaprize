import ExploreCard from '@/components/Prize/ExplorePrize/explorePrize';
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
          revalidate: 0,
        },
      },
    )
  ).data.data;

  return (
    <>
      {prizes.map((prize) => {
        return (
          <ExploreCard
            distributed={prize.distributed}
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
