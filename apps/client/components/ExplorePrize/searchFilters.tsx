//eslint-disable-next-line @typescript-eslint/ban-ts-comment -- TODO: fix
// @ts-nocheck

'use client';

import { Button, Drawer, Group, Menu, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Filter from './filterComponent';
import Link from 'next/link';
// import Filter from "./filterComponent";

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

  const handleSort = (value: string) => {
    params.set('sort', value);
    router.replace({ query: params.toString() });
  };

  return (
    <div className="p-5">
      <Group mb="xs" mt="md" justify="space-between">
        <TextInput
          rightSection={<IconSearch size="1rem" />}
          placeholder="Search"
          className="sm:w-[500px]"
        />
        <Group justify="space-between">
          <Link href="/prize/about">
            <Button>About Prize</Button>
          </Link>
          <Link href="/prize/create">
            <Button>Create Prize </Button>
          </Link>

          <Button onClick={open}>Filter</Button>
          {/* <Button>Sort</Button> */}
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button>Sort</Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Sort By</Menu.Label>
              <Menu.Divider />
              {sortKeys.map((key) => {
                return (
                  <Menu.Item
                    key={key.value}
                    onClick={() => {
                      handleSort(key.value);
                    }}
                    className={`${
                      key.value === searchParams?.get('sort')
                        ? 'font-bold'
                        : 'font-normal'
                    }`}
                  >
                    {key.label}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
      <Drawer opened={opened} onClose={close} title="Filters" position="right">
        <Filter />
      </Drawer>
    </div>
  );
}
