//eslint-disable-next-line @typescript-eslint/ban-ts-comment -- TODO: fix
// @ts-nocheck

import {
  Box,
  Checkbox,
  Group,
  RangeSlider,
  Select,
  Stack,
  Text,
  rem,
} from '@mantine/core';
import { IconCoin, IconCurrencyDollar } from '@tabler/icons-react';
import { useRouter } from 'next/router';

const categoryOptions = ['Proficiency', 'Priorities'];
const proficiencyOptions = [
  'Programming',
  'Python',
  'JavaScript',
  'Writing',
  'Design',
  'Translation',
  'Research',
  'Real estate',
  'Apps',
  'Hardware',
  'Art',
  'Meta',
  'AI',
];

const priorityOptions = [
  'Climate Change',
  'Network Civilizations',
  'Open-Source',
  'Community Coordination',
  'Health',
  'Education',
];

function toTuple(arr: number[]): [number, number] {
  return [arr[0], arr[1]];
}

function Filter() {
  const router = useRouter();
  const searchParams = router.query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix
  const params = new URLSearchParams(searchParams as any as string);
  const selectedCategories = (searchParams.category || '') as string;
  const subCategory = searchParams.subCategory
    ? (searchParams.subCategory as string).split(',')
    : [];
  console.log(subCategory);

  // const range = (
  //   searchParams.range ? (searchParams.range as string).split(",") : [0, 500]
  // ) as number[];

  const RangeValue = () => {
    const ranges = (
      searchParams.range ? (searchParams.range as string).split(',') : [0, 500]
    ) as number[];

    if (ranges[1] > 500) {
      ranges[1] = 500;
    }

    if (ranges[0] < 0) {
      ranges[0] = 0;
    }

    const value1 = parseInt(ranges[0]);
    const value2 = parseInt(ranges[1]);
    const range = [value1, value2];
    return range;
  };

  const range = RangeValue();
  console.log(range);

  const handlerange = async (value: number[]) => {
    params.set('range', value.join(','));
    await router.replace(`?${params.toString()}`, undefined, { shallow: true });
  };

  const handleCategory = async (value: string) => {
    params.set('category', value);
    await router.replace(`?${params.toString()}`, undefined, { shallow: true });
    await handleSubCategory([]);
  };

  const handleSubCategory = async (value: string[]) => {
    params.set('subCategory', value.join(','));
    await router.replace(`?${params.toString()}`, undefined, {
      shallow: true,
    });
  };

  return (
    <Box maw={400} mx="auto">
      <Text>Price range ($)</Text>
      <RangeSlider
        mt="xl"
        styles={{ thumb: { borderWidth: rem(2), padding: rem(3) } }}
        color="blue"
        max={500}
        min={0}
        label={null}
        defaultValue={toTuple(range)}
        thumbSize={26}
        thumbChildren={[
          <IconCurrencyDollar size="1rem" key="1" />,
          <IconCoin size="1rem" key="2" />,
        ]}
        onChange={(value) => {
          void handlerange(value);
        }}
      />
      <Group justify="space-between" align="center">
        <Box my="md" styles={{}}>
          <b>{range[0]}</b>
        </Box>
        <Box my="md">
          <b>{range[1]}</b>
        </Box>
      </Group>
      <Select
        mb="md"
        label="Categories"
        placeholder="Pick value"
        data={categoryOptions}
        allowDeselect={false}
        value={selectedCategories}
        onChange={(value) => {
          if (value) {
            void handleCategory(value);
          }
        }}
      />
      <Checkbox.Group
        defaultValue={[]}
        label={selectedCategories && 'Sub Categories'}
        value={subCategory}
        onChange={(value) => void handleSubCategory(value)}
      >
        {selectedCategories === 'Proficiency' && (
          <Stack mt="xs">
            {proficiencyOptions.map((option) => (
              <Checkbox key={option} value={option} label={option} />
            ))}
          </Stack>
        )}

        {selectedCategories === 'Priorities' && (
          <Stack mt="xs">
            {priorityOptions.map((option) => (
              <Checkbox key={option} value={option} label={option} />
            ))}
          </Stack>
        )}
      </Checkbox.Group>
    </Box>
  );
}

export default Filter;
