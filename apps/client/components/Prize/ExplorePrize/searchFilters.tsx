//eslint-disable-next-line @typescript-eslint/ban-ts-comment -- TODO: fix
// @ts-nocheck

'use client';

import { Button, Drawer, Group, Menu, TextInput } from '@mantine/core';
import { useDisclosure, useDebouncedCallback } from '@mantine/hooks';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Filter from './filterComponent';
import Link from 'next/link';

type Sorts = Record<string, string>;

const sorts: Sorts = {
  'Date: Old to New': 'date.asc',
  'Date: New to Old': 'date.desc',
  'Prize: Low to High': 'prize.asc',
  'Prize: High to Low': 'prize.desc',
  'Deadline: Sooner to Later': 'deadline.asc',
  'Deadline: Later to Sooner': 'deadline.desc',
};

const sortKeys = Object.keys(sorts).map((key) => ({
  label: key,
  value: sorts[key],
}));

export default function SearchFilters() {
  const [opened, { open, close }] = useDisclosure(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- its needed
  const params = new URLSearchParams(searchParams as any as string);
  const currentSearch = searchParams?.get('search') || '';

  const handleSearch = useDebouncedCallback((value: string) => {
    if (value.length >= 3) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.replace({ query: params.toString() });
  }, 500);

  const handleClear = () => {
    params.delete('search');
    router.replace({ query: params.toString() });
  };

  const handleSort = (value: string) => {
    params.set('sort', value);
    router.replace({ query: params.toString() });
  };

  return (
    <div className="p-5">
      <Group mb="xs" mt="md" justify="space-between">
        <TextInput
          rightSection={
            currentSearch ? (
              <IconX size="1rem" onClick={handleClear} style={{ cursor: 'pointer' }} />
            ) : (
              <IconSearch size="1rem" />
            )
          }
          placeholder="Search by title..."
          className="sm:w-[500px]"
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.currentTarget.value)}
        />
        <Group justify="space-between">
          <Link href="/prize/about">
            <Button>About Prize</Button>
          </Link>
          <Link href="/prize/create">
            <Button>Create Prize </Button>
          </Link>
        </Group>
      </Group>
      <Drawer opened={opened} onClose={close} title="Filters" position="right">
        <Filter />
      </Drawer>
    </div>
  );
}
