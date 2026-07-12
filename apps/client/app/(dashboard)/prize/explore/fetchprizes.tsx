/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import ExploreCard from '@/components/Prize/ExplorePrize/explorePrize';
import { FetchPrizesCsv } from '@/components/history/fetch-csv';
import HistoryCard from '@/components/history/history-card';
import { Api } from '@/lib/api';
import { Text } from '@mantine/core';

export default async function FetchPrizes({ searchParams }: { searchParams?: { search?: string } }) {
  // Get search query from URL params if available
  const searchQuery = searchParams?.search;

  let prizes: any[] = [];
  let error: string | null = null;

  try {
    const response = await new Api().prizes.prizesList(
      {
        limit: 20,
        page: 1,
        ...(searchQuery ? { search: searchQuery } : {}),
      },
      {
        next: {
          revalidate: 0,
        },
      },
    );
    prizes = response.data.data;
  } catch (e) {
    error = 'Failed to load prizes. Please try again later.';
  }

  const data = await FetchPrizesCsv();

  return (
    <>
      {error && (
        <Text c="red" size="md" ta="center" mt="md">
          {error}
        </Text>
      )}
      {!error && prizes.length === 0 && (
        <Text size="md" ta="center" mt="md" c="dimmed">
          {searchQuery ? 'No prizes found matching your search.' : 'No prizes available.'}
        </Text>
      )}
      {prizes.map((prize) => {
        return (
          <ExploreCard
            refund={prize.refunded}
            isActive={prize.is_active_blockchain}
            startVoteBlockchain={prize.voting_time_blockchain}
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
            contributers={prize.contributors}
            stage={prize.stage}
          />
        );
      })}

      {data.reverse().map((prize) => {
        if (
          (prize.Awarded &&
            prize.PrizeName) ||
          prize.DatePosted ||
          prize.AwardedUSDe ||
          prize.WinnersAmount
        ) {
          const status = prize.WinnersAmount ? 'Won' : 'Refunded';
          return (
            <HistoryCard
              key={prize.Id}
              imageUrl={prize.CardImage}
              id={prize.Id}
              status={status}
              datePosted={prize.DatePosted}
              title={prize.PrizeName}
              description={prize.SimpleDescription}
              awarded={`${prize.AwardedUSDe} USD`}
              category={prize.Category}
              contestants={prize.ContestantsCount}
            />
          );
        }
        return null;
      })}
    </>
  );
}
