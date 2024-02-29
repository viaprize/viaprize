import { backendApi } from '@/lib/backend';
import { Button, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { formatEther } from 'viem';
import { usePublicClient, useQuery } from 'wagmi';
import ExploreCard from '../Prize/ExplorePrize/explorePrize';
import Shell from '../custom/shell';
import SkeletonLoad from '../custom/skeleton-load-explore';
import getCryptoToUsd from '../hooks/server-actions/CryptotoUsd';

export default function PrizeTabs({ params }: { params: { id: string } }) {
  const client = usePublicClient();
  const router = useRouter();

  const getPrizesOfUserMutation = useQuery(['getPrizesOfUser', undefined], async () => {
    const prizes = await (await backendApi()).users.usernamePrizesDetail(params.id);

    return prizes.data;
  });

  const { data: ethToUsd } = useQuery(['cryptoToUsd', undefined], async () =>
    getCryptoToUsd(),
  );

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
            startingTimeBlockchain={prize.submission_time_blockchain}
            distributed={false}
            description={prize.description}
            submissionDays={prize.submissionTime}
            createdAt={prize.created_at}
            imageUrl={prize.images[0]}
            profileName=""
            ethAmount={formatEther(BigInt(prize.balance))}
            usdAmount={(
              parseFloat(formatEther(BigInt(prize.balance))) *
              (ethToUsd?.ethereum.usd ?? 0)
            ).toFixed(2)}
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
