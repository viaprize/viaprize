import { Text } from '@mantine/core';

interface DetailProps {
  fundingRecieved: number;
  daysLeft: number;
  contributors: number;
}

export default function DetailCard({
  fundingRecieved,
  daysLeft,
  contributors,
}: DetailProps) {
  return (
    <div className=" bg-gray-200  p-2 rounded-md  w-full ">
      <div className="lg:flex items-center justify-between mx-2">
        <div className="">
          <Text size="lg" fw="bold">
            {fundingRecieved}
          </Text>
          <Text size="md">funding received in current round</Text>
        </div>
        <div className="">
          <Text size="lg" fw="bold">
            {daysLeft}
          </Text>
          <Text size="md">Round ended</Text>
        </div>
      </div>

      <Text size="lg" mt="md" ml="md" fw="bold">
        {contributors}
      </Text>
      <Text size="md" ml="md">
        contributors
      </Text>
    </div>
  );
}
