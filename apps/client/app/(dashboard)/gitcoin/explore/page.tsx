import { Badge, Button, Card, Divider, Pill, Text, TextInput } from '@mantine/core';
import {
  IconCalendarMonth,
  IconCircleCheckFilled,
  IconSearch,
  IconShoppingCart,
} from '@tabler/icons-react';
import Link from 'next/link';
import { Suspense } from 'react';
import FetchGitcoins from './fetch-explore';
import StepperInfo from './stepper-info';

export default function ExploreGitcoin() {
  return (
    <div>
      <div className="max-w-screen-xl w-screen">
        <div className="lg:flex items-center space-y-4 lg:space-y-0 justify-between">
          <div className="lg:flex items-center space-y-4 lg:space-y-0">
            <Text size="25px" fw="bolder" ml="md">
              Hypercerts Ecosystem Round
            </Text>
            <Badge leftSection={<IconCircleCheckFilled />} color="teal" size="lg" ml="md">
              Credit Card Donation Available
            </Badge>

            <Link href="/gitcoin/cart">
              <Button
                className="ml-4 mt-2 lg:mt-0 "
                leftSection={<IconShoppingCart />}
                variant="outline"
              >
                View my cart
              </Button>
            </Link>
          </div>
          <Card
            radius="sm"
            p="md"
            mx="md"
            className="font-bold w-40 lg:w-70 bg-[#666666]  text-white"
            style={{
              color: 'white',
            }}
          >
            60,000 USDC <br /> Matching Pool
          </Card>
        </div>
        <div className="sm:flex justify-between items-center my-2">
          <div className="flex items-center space-x-2 ml-4 ">
            <Text size="md" c="gray">
              Donate
            </Text>
            <IconCalendarMonth />
            <div className="lg:flex">
              <Pill size="md" color="gray">
                2024/04/23{' | '} 5:00 EAT
              </Pill>{' '}
              -{' '}
              <Pill size="md" color="gray">
                2024/05/08 {' | '}2:59 EAT
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
        {/* <TextInput
          leftSection={<IconSearch size="1rem" />}
          placeholder="Search"
          className="lg:w-[300px] lg:ml-4 mx-4 my-3"
        /> */}

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
