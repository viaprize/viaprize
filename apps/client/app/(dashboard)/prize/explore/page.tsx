import SkeletonLoad from '@/components/custom/skeleton-load-explore';
import { Button, Group, Text } from '@mantine/core';
import Link from 'next/link';
import { Suspense } from 'react';
import FetchPrizes from './fetchprizes';
import HistoryPage from '@/components/history/history-page';

function ExplorePage() {
  return (
    <div className="max-w-screen-xl">
      <div className="sm:flex justify-between">
        <div>
          <Text size="25px" fw="bolder" mt="md" ml="md">
            Explore Prizes
          </Text>
          <Text size="md" fw="initial" mt="xs" ml="md">
            you can explore prizes and work on them
          </Text>
        </div>
        <Group mt="md" mb="md" className="max-sm:ml-7">
          <Link href="/prize/about">
            <Button component="a">About Prizes</Button>
          </Link>
          <Link href="/prize/create">
            <Button component="a">Create Prizes</Button>
          </Link>
        </Group>
      </div>
      {/* <SearchFilters /> */}
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <Suspense fallback={<SkeletonLoad />}>
          {/* @ts-expect-error Server Component */}
          <FetchPrizes />
        </Suspense>
        {/* Add as many ExploreCard components as you need */}
      </div>
      {/* @ts-expect-error Server Component */}
      <HistoryPage />
    </div>
  );
}

export default ExplorePage;
