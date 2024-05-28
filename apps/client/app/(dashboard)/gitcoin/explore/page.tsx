import Paging from '@/components/custom/paging';
import {
  Badge,
  Button,
  Divider,
  Flex,
  Pill,
  Stepper,
  Text,
  TextInput,
} from '@mantine/core';
import {
  IconCalendarMonth,
  IconCircleCheckFilled,
  IconCreditCardFilled,
  IconDna,
  IconSearch,
  IconShoppingCartFilled,
  IconShoppingCart,
} from '@tabler/icons-react';
import StepperInfo from './stepper-info';
import Link from 'next/link';
import { Suspense } from 'react';
import FetchGitcoins from './fetch-explore';

export default function ExploreGitcoin() {
  return (
    <div>
      {' '}
      <div className="max-w-screen-xl w-screen">
        <div className="lg:flex items-center justify-between">
          <div className="lg:flex items-center ">
            <Text size="25px" fw="bolder" ml="md">
              Hypercerts Ecosystem Round
            </Text>
            <Badge
              leftSection={<IconCircleCheckFilled />}
              color="teal"
              size="md"
              ml="md"
              p="sm"
            >
              Credit Card Donation Available
            </Badge>

            <Link className="mx-2" href="/gitcoin/cart">
              <Button leftSection={<IconShoppingCart />} variant="outline">
                View my cart
              </Button>
            </Link>
          </div>
          {/* <Link href="/portal/about" className="text-blue-600 underline">
            <Text size="md" fw="initial" mt="xs" ml="md">
              About Gitcoin{' '}
            </Text>
          </Link> */}
          <div className="bg-gray-200 p-3 rounded-md font-semibold w-[200px] ml-2 lg:mx-2 ">
            60,000 USDC <br /> Matching Pool
          </div>
        </div>
        <div className="sm:flex justify-between items-center my-2">
          <div className="flex items-center space-x-2 ml-4 ">
            <Text size="md" c="gray">
              Donate
            </Text>
            <IconCalendarMonth />
            <div className="lg:flex">
              <Pill size="md" color="gray">
                2024/04/2315:00 EAT
              </Pill>{' '}
              -{' '}
              <Pill size="md" color="gray">
                2024/05/0802:59 EAT
              </Pill>
            </div>
          </div>
        </div>
        <p className="ml-4">
          This round aims to strengthen the Hypercerts Ecosystem to realize the vision of
          an interconnected impact funding network. We specifically want to support
          projects 1. that integrate hypercerts into existing funding platforms—similar to
          the hypercerts integration with Gitcoin, 2. that develop new applications like
          prize competitions leveraging the hypercerts infrastructure, 3. that build
          tooling to extent the functionality for multiple integrations and applications,
          such as Deresy to coordinate evaluators, or 4. that are tangible use cases
          piloting new functionalities, e.g. implementing retroactive funding rounds with
          hypercerts or using hyperboards.
        </p>
        <StepperInfo />
        <Divider />
        <TextInput
          leftSection={<IconSearch size="1rem" />}
          placeholder="Search"
          className="lg:w-[300px] lg:ml-4 mx-4 my-3"
        />

        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
          <Suspense fallback={<div>Loading...</div>}>
            {/* @ts-expect-error Server Component */}
            <FetchGitcoins />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
