import { gitcoinRounds } from '@/lib/constants';
import { Badge, Button, Card, Divider, Pill, Text } from '@mantine/core';
import {
  IconCalendarMonth,
  IconCircleCheckFilled,
  IconShoppingCart,
} from '@tabler/icons-react';
import Link from 'next/link';
import { Suspense } from 'react';
import FetchGitcoins from './fetch-explore';
import StepperInfo from './stepper-info';

export const dynamic = 'force-dynamic';
export default function ExploreGitcoin({ params }: { params: { roundslug: string } }) {
  const round = gitcoinRounds.find((roundd) => roundd.roundSlug === params.roundslug);
  return (
    <div>
      <div className="max-w-screen-xl w-screen">
        <div className="lg:flex items-center space-y-4 lg:space-y-0 justify-between">
          <div className="lg:flex items-center space-y-4 lg:space-y-0">
            <Text size="25px" fw="bolder" ml="md">
              {round?.title}
            </Text>
            <Badge leftSection={<IconCircleCheckFilled />} color="teal" size="lg" ml="md">
              Credit Card Donation Available
            </Badge>

            <Link href={`/qf/${round?.roundSlug}/cart`}>
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
            {round?.matchingPool} USDC <br /> Matching Pool
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
                {round?.startDate.toLocaleString()}
              </Pill>{' '}
              -{' '}
              <Pill size="md" color="gray">
                {round?.endDate.toLocaleString()}
              </Pill>
            </div>
          </div>
        </div>
        <p className="ml-4">{round?.description}</p>
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
            <FetchGitcoins params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
