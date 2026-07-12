import SkeletonLoad from '@/components/custom/skeleton-load-explore';
import SearchFilters from '@/components/Prize/ExplorePrize/searchFilters';
import { Button, Group, Text } from '@mantine/core';
import Link from 'next/link';
import { Suspense } from 'react';
import FetchPrizes from './fetchprizes';
import SubscriptionForm from '@/components/newsletter/subscriptionForm';

function ExplorePage({ searchParams }: { searchParams?: { search?: string } }) {
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
          <Group m="md" className="max-sm:ml-7">
            <Link href="/prize/about">
              <Button component="a">About Prizes</Button>
            </Link>
            <Link href="/prize/create">
              <Button component="a">Create Prizes</Button>
            </Link>
          </Group>
        </div>

        <div className=" w-full lg:w-1/3 my-2">
          <SubscriptionForm />
        </div>
      </div>

      {/* Search filters with title-based search */}
      <SearchFilters />

      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <Suspense fallback={<SkeletonLoad />}>
          {/* @ts-expect-error Server Component */}
          <FetchPrizes searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

export default ExplorePage;
