import { Button, Drawer, Group, Menu, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import Filter from './filterComponent';

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

export function SearchFilters() {
  const [opened, { open, close }] = useDisclosure(false);

  const router = useRouter();
  const searchParams = router.query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix
  const params = new URLSearchParams(searchParams as any as string);

  const handleSort = async (value: string) => {
    params.set('sort', value);
    await router.replace({ query: params.toString() });
  };

  return (
    <div className="p-5">
      <Text size="25px" weight={500}>
        Explore Prizes
      </Text>
      <Text size="sm" weight={300}>
        you can explore prizes and work on them
      </Text>
      <Group mb="xs" mt="md" position="apart">
        <TextInput
          icon={<IconSearch size="1rem" />}
          placeholder="Search"
          style={{ width: '500px' }}
        />
        <Group position="right">
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
                    onClick={() => void handleSort(key.value)}
                    className={`${
                      key.value === searchParams.sort ? 'font-bold' : 'font-normal'
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
