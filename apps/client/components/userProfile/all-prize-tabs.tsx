import { backendApi } from '@/lib/backend';
import { Skeleton } from '@mantine/core';
import { formatEther } from 'viem';
import { usePublicClient, useQuery } from 'wagmi';
import ExploreCard from '../Prize/ExplorePrize/explorePrize';

export default function PrizeTabs({ params }: { params: { id: string } }) {
  const client = usePublicClient();
  const getPrizesOfUserMutation = useQuery(['getPrizesOfUser', undefined], async () => {
    const prizes = await (await backendApi()).users.usernamePrizesDetail(params.id);

    const prizesWithBalancePromise = prizes.data.map(async (prize) => {
      const balance = await client.getBalance({
        address: prize.contract_address as `0x${string}`,
      });
      return {
        ...prize,
        balance,
      };
    });
    const prizesWithBalance = await Promise.all(prizesWithBalancePromise);

    return prizesWithBalance;
  });

  return (
    <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1'>
      <Skeleton visible={getPrizesOfUserMutation.isLoading}>
        {getPrizesOfUserMutation.data?.map((prize) => {
          return (
            <ExploreCard
              distributed={false}
              description={prize.description}
              submissionDays={prize.submissionTime}
              createdAt={prize.created_at}
              imageUrl={prize.images[0]}
              money={formatEther(BigInt(prize.balance))}
              profileName=""
              title={prize.title}
              key={prize.id}
              id={prize.id}
              skills={prize.priorities || prize.proficiencies}
            />
          );
        })}
      </Skeleton>
    </div>
  );
}
