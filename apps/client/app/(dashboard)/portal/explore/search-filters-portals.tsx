//eslint-disable-next-line @typescript-eslint/ban-ts-comment -- TODO: fix
// @ts-nocheck

'use client';

import { Button, Drawer, Group, Menu, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PortalFilterDrawer from './portal-filter-drawer';
// import Filter from "./filterComponent";
import { useCallback, useTransition } from 'react';

type Sorts = Record<string, string>;

const sorts: Sorts = {
  'Date: Old to New': 'ASC',
  'Date: New to Old': 'DESC',
  // 'Prize: Low to High': 'prize.asc',
  // 'Prize: High to Low': 'prize.desc',
  // 'Deadline: Sooner to Later': 'deadline.asc',
  // 'Deadline: Later to Sooner': 'deadline.desc',
};

const sortKeys = Object.keys(sorts).map((key) => ({
  label: key,
  value: sorts[key],
}));

export default function SearchFiltersPortals() {
  const [opened, { open, close }] = useDisclosure(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const params = new URLSearchParams(searchParams as any as string);
  const sort = searchParams?.get('sort') ?? 'DESC';

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  return (
    <div className="p-5">
      <Group mb="xs" mt="md" justify="space-between">
        <TextInput
          icon={<IconSearch size="1rem" />}
          placeholder="Search"
          className="sm:w-[500px]"
        />
        <Group justify="space-between">
          <Button onClick={open}>Filter</Button>
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
                    disabled={isPending}
                    onClick={() => {
                      startTransition(() => {
                        router.push(
                          `${pathname}?${createQueryString({
                            sort: key.value,
                          })}`,
                          {
                            scroll: false,
                          },
                        );
                      });
                    }}
                    className={`${key.value === sort ? 'font-bold' : 'font-normal'}`}
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
        <PortalFilterDrawer />
      </Drawer>
    </div>
  );
}
