import { Button, Group, Text } from '@mantine/core';
import { Suspense } from 'react';
import FetchPrizes from './fetchprizes';
import SearchFilters from '@/components/ExplorePrize/searchFilters';
import SkeletonLoad from '@/components/custom/skeleton-load-explore';
import Link from 'next/link';

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
          <Link href="/portal/about">
            <Button component="a">About Portals</Button>
          </Link>
          <Link href="/portal/create">
            <Button component="a">Create Portal</Button>
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
    </div>
  );
}

export default ExplorePage;
