import ExploreCard from '@/components/ExplorePrize/explorePrize';
import SearchFilters from '@/components/ExplorePrize/searchFilters';
import AppShellLayout from '@/components/layout/appshell';
import { Api, PrizeWithBalance } from '@/lib/api';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { ReactElement } from 'react';
import { formatEther } from 'viem';

function ExplorePage({ prizes }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="max-w-screen-xl">
      <SearchFilters />
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
        {prizes.map((prize) => (
          <ExploreCard
            description={prize.description}
            imageUrl={prize.images[0]}
            deadline=""
            money={formatEther(BigInt(prize.balance))}
            profileName={''}
            title={prize.title}
            key={prize.id}
            id={prize.id}
          />
        ))}
        {/* Add as many ExploreCard components as you need */}
      </div>
    </div>
  );
}
export const getServerSideProps = (async () => {
  const data = (
    await new Api().prizes.prizesList({
      limit: 10,
      page: 1,
    })
  ).data.data;
  return { props: { prizes: data } };
}) satisfies GetServerSideProps<{
  prizes: PrizeWithBalance[];
}>;

ExplorePage.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};

export default ExplorePage;
