import SkeletonLoad from '@/components/custom/skeleton-load-explore';
import type { SearchParams } from '@/lib/types';
import { Button, Group, Text } from '@mantine/core';
import Link from 'next/link';
import { Suspense } from 'react';
import FetchPortals from './fetchportals';
import SearchFiltersPortals from './search-filters-portals';
import Paging from '@/components/custom/paging';
import SubscriptionForm from '@/components/newsletter/subscriptionForm';

export default function ExplorePortal({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="max-w-screen-xl w-screen">
      <div className="sm:flex justify-between">
        <div>
          <Text size="25px" fw="bolder" mt="md" ml="md">
            Explore Fundraiser Campaigns
          </Text>
          <Text size="md" fw="initial" mt="xs" ml="md">
            you can explore fundraisers and work on them
          </Text>
          <Group m='md' className="max-sm:ml-7">
            <Link href="/portal/about">
              <Button component="a">About Fundraisers</Button>
            </Link>
            <Link href="/portal/create">
              <Button component="a">Create Fundraisers</Button>
            </Link>
          </Group>
        </div>
        <div className=" w-full lg:w-1/3 my-2">
          <SubscriptionForm />
        </div>
      </div>
      <SearchFiltersPortals />

      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <Suspense fallback={<SkeletonLoad />}>
          {/* @ts-expect-error Server Component */}
          <FetchPortals searchParams={searchParams} />
        </Suspense>
      </div>
      <Paging total={2} />
    </div>
  );
}
