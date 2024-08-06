import { backendApi } from '@/lib/backend';
import type { ConvertUSD } from '@/lib/types';
import { Button, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { usePublicClient, useQuery } from 'wagmi';
import ExploreCard from '../Prize/ExplorePrize/explorePrize';
import Shell from '../custom/shell';
import SkeletonLoad from '../custom/skeleton-load-explore';
import useAuthPerson from '../hooks/useAuthPerson';

export default function PrizeTabs({ params }: { params: { id: string } }) {
  const client = usePublicClient();
  const router = useRouter();

  const getPrizesOfUserMutation = useQuery(['getPrizesOfUser'], async () => {
    const prizes = await (await backendApi()).users.usernamePrizesDetail(params.id);

    return prizes.data;
  });
  const isProfileOwner = useAuthPerson();

  const { data: cryptoToUsd } = useQuery<ConvertUSD>(['get-crypto-to-usd'], async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const final = await (
      await fetch(`https://api-prod.pactsmith.com/api/price/usd_to_eth`)
    ).json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.keys(final).length === 0
      ? {
          ethereum: {
            usd: 0,
          },
        }
      : final;
  });

  if (getPrizesOfUserMutation.isLoading)
    return <SkeletonLoad gridedSkeleton numberOfCards={3} />;

  if (!getPrizesOfUserMutation.data || getPrizesOfUserMutation.data.length === 0)
    return (
      <Shell>
        <Text>No Prizes</Text>
        {isProfileOwner ? (
          <Button
            onClick={() => {
              router.push('/prize/create');
            }}
            className="mt-4"
          >
            Create Prize
          </Button>
        ) : null}
      </Shell>
    );

  return (
    <div className="grid gap-2 md:grid-cols-2 grid-cols-1">
      {getPrizesOfUserMutation.data.map((prize) => {
        return (
          <ExploreCard
            contestants={prize.contestants?.length || 0}
            startingTimeBlockchain={prize.submission_time_blockchain}
            distributed={false}
            description={prize.description}
            submissionMinutes={prize.submissionTime}
            createdAt={prize.created_at}
            imageUrl={prize.images[0]}
            profileName=""
            usdAmount={(prize.balance / 1_000_000).toFixed(2)}
            title={prize.title}
            key={prize.id}
            id={prize.id}
            skills={prize.proficiencies}
            slug={prize.slug}
            startSubmissionDate={new Date(prize.startSubmissionDate)}
            startVotingDate={new Date(prize.startVotingDate)}
            contributers={prize.contributors}
            stage={prize.stage}
          />
        );
      })}
    </div>
  );
}
