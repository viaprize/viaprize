import { backendApi } from '@/lib/backend';
import { Button, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { formatEther } from 'viem';
import { usePublicClient, useQuery } from 'wagmi';
import ExploreCard from '../Prize/ExplorePrize/explorePrize';
import Shell from '../custom/shell';
import SkeletonLoad from '../custom/skeleton-load-explore';

export default function PrizeTabs({ params }: { params: { id: string } }) {
  const client = usePublicClient();
  const router = useRouter();
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

  if (getPrizesOfUserMutation.isLoading)
    return <SkeletonLoad gridedSkeleton numberOfCards={3} />;

  if (!getPrizesOfUserMutation.data || getPrizesOfUserMutation.data.length === 0)
    return (
      <Shell>
        <Text>You dont have any Prizes</Text>
        <Button
          onClick={() => {
            router.push('/prize/create');
          }}
          className="mt-4"
        >
          Create Prize
        </Button>
      </Shell>
    );

  return (
    <div className="grid gap-2 md:grid-cols-2 grid-cols-1">
      {getPrizesOfUserMutation.data.map((prize) => {
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
            skills={prize.proficiencies}
          />
        );
      })}
    </div>
  );
}
