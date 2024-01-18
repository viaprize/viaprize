import { campaignsTags } from '@/lib/constants';
import { type Option } from '@/lib/types';
import { toTitleCase } from '@/lib/utils';
import { Box, Button, Card, Checkbox, Stack, Text } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';

function PortalFilterDrawer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const categoriesParam = searchParams?.get('categories');
  // const rangeParam = searchParams?.get('price_range');

  const [isPending, startTransition] = useTransition();

  // const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  // const debouncedPrice = useDebounce(priceRange, 500);

  const [selectedCategories, setSelectedCategories] = useState<Option[] | null>(
    categoriesParam
      ? categoriesParam.split('.').map((c) => ({
          label: toTitleCase(c),
          value: c,
        }))
      : null,
  );

  const clearFilters = useCallback(() => {
    // setPriceRange([0, 500]);
    setSelectedCategories(null);
    const pathNameWithoutParams = pathname?.split('?')[0];
    startTransition(() => {
      router.push(pathNameWithoutParams ?? '', {
        scroll: false,
      });
    });
  }, []);

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

  // useEffect(() => {
  //   const [min, max] = debouncedPrice;
  //   startTransition(() => {
  //     const newQueryString = createQueryString({
  //       price_range: `${min}-${max}`,
  //     });

  //     router.push(`${pathname}?${newQueryString}`, {
  //       scroll: false,
  //     });
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps -- only one is needed
  // }, [debouncedPrice]);

  useEffect(() => {
    console.log('this should run');
    startTransition(() => {
      const newQueryString = createQueryString({
        categories: selectedCategories?.length
          ? // Join categories with a dot to make search params prettier
            selectedCategories.map((c) => c.value).join('.')
          : null,
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories]);

  return (
    <Box maw={400} mx="auto" className="relative">
      {/* <Card my="md" p="md" radius="md" shadow="sm">
        <Text>Price range ($)</Text>
        <RangeSlider
          mt="xl"
          styles={{ thumb: { borderWidth: rem(2), padding: rem(3) } }}
          max={500}
          min={0}
          label={null}
          defaultValue={
            rangeParam
              ? (rangeParam.split('-').map(Number) as [number, number])
              : [0, 500]
          }
          thumbSize={26}
          value={priceRange}
          thumbChildren={[
            <IconCurrencyDollar size="1rem" key="1" />,
            <IconCoin size="1rem" key="2" />,
          ]}
          onChange={(value: typeof priceRange) => {
            setPriceRange(value);
          }}
        />
        <Group justify="space-between" align="center">
          <Box my="md">
            <b>{priceRange[0]}</b>
          </Box>
          <Box my="md">
            <b>{priceRange[1]}</b>
          </Box>
        </Group>
        <div className="flex items-center space-x-4">
          <Input
            className="w-full"
            type="number"
            inputMode="numeric"
            min={0}
            max={priceRange[1]}
            value={priceRange[0]}
            onChange={(e) => {
              const value = Number(e.target.value);
              setPriceRange([value, priceRange[1]]);
            }}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            className="w-full"
            type="number"
            inputMode="numeric"
            min={priceRange[0]}
            max={500}
            value={priceRange[1]}
            onChange={(e) => {
              const value = Number(e.target.value);
              setPriceRange([priceRange[0], value]);
            }}
          />
        </div>
      </Card> */}
      <Card my="md" p="md" radius="md" shadow="sm">
        <Text>Status</Text>
        <Checkbox my="sm" label="Active" />
        <Checkbox
          mb="sm"
          label="has Funding Goal"
          checked={selectedCategories?.some((c) => c.value === 'Funding Goal') ?? false}
          onChange={(e) => {
            setSelectedCategories((prevCategories) => {
              if (e.target.checked) {
                // Add the category if it doesn't exist
                if (!prevCategories?.some((c) => c.value === 'Funding Goal')) {
                  return [
                    ...(prevCategories || []), // Ensure prevCategories is not null or undefined
                    { label: 'Funding Goal', value: 'Funding Goal' },
                  ];
                }
              } else {
                // Remove the category if it exists
                return prevCategories?.filter((c) => c.value !== 'Funding Goal') || null; // Ensure null is returned if prevCategories is null
              }

              // If no changes, return the current state
              return prevCategories || null; // Ensure null is returned if prevCategories is null
            });
          }}
        />
        <Checkbox
          label="has Deadline"
          checked={selectedCategories?.some((c) => c.value === 'Deadline') ?? false}
          onChange={(e) => {
            setSelectedCategories((prevCategories) => {
              if (e.target.checked) {
                // Add the category if it doesn't exist
                if (!prevCategories?.some((c) => c.value === 'Deadline')) {
                  return [
                    ...(prevCategories || []),
                    { label: 'Deadline', value: 'Deadline' },
                  ];
                }
              } else {
                // Remove the category if it exists
                return prevCategories?.filter((c) => c.value !== 'Deadline') || null;
              }

              // If no changes, return the current state
              return prevCategories || null;
            });
          }}
        />
      </Card>

      <Card my="md" p="md" radius="md" shadow="sm">
        <Text>Categories</Text>
        <Checkbox.Group
          defaultValue={categoriesParam ? categoriesParam.split('.') : []}
          value={selectedCategories?.map((c) => c.value) ?? []}
          onChange={(value) => {
            setSelectedCategories(
              value.map((c) => ({
                label: toTitleCase(c),
                value: c,
              })),
            );
          }}
        >
          <Stack mt="xs">
            {campaignsTags.map((option) => (
              <Checkbox key={option} value={option} label={option} />
            ))}
          </Stack>
        </Checkbox.Group>
      </Card>

      <Button color="primary" fullWidth onClick={clearFilters} disabled={isPending}>
        Clear filters
      </Button>
    </Box>
  );
}

export default PortalFilterDrawer;
