'use client';
import SkeletonLoad from '@/components/custom/skeleton-load-explore';
import { Button, Group, Text } from '@mantine/core';
import Link from 'next/link';
import { Suspense } from 'react';
import FetchPortals from './fetchportals';

export default function ExplorePortal() {
  return (
    <div className="max-w-screen-xl w-screen">
      <div className='sm:flex justify-between'>
        <div>
          <Text size="25px" fw="bolder" mt="md" ml="md">
            Explore Portal
          </Text>
          <Text size="md" fw="initial" mt="xs" ml="md">
            you can explore portal and work on them
          </Text>
        </div>
        <Group mt="md" mb="md" className='max-sm:ml-7'>
          <Link href="/portal/about">
            <Button component="a">About Portals</Button>
          </Link>
          <Link href="/portal/create">
            <Button component="a">Create Portal</Button>
          </Link>
        </Group>
      </div>
      {/* <SearchFiltersPortals /> */}
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <Suspense fallback={<SkeletonLoad />}>
          {/* @ts-expect-error Server Component */}
          <FetchPortals />
        </Suspense>
      </div>
    </div>
  );
}
