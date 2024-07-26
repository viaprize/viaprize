import { Text } from '@mantine/core';

interface DetailProps {
  fundingRecieved: number;
  daysLeft: string;
  contributors: number;
}

function getRemainingDays(endTime) {
  const endDate = new Date(endTime);
  const currentDate = new Date();
  const diffTime = endDate - currentDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `${diffDays} days to go`;
  } else {
    return `Ended ${Math.abs(diffDays)} days ago`;
  }
}

export default function DetailCard({
  fundingRecieved,
  daysLeft,
  contributors,
}: DetailProps) {
  return (
    <div className="bg-gray-200 p-2 rounded-xl w-full">
      <div className="lg:flex items-center justify-between mx-2">
        <div className="">
          <Text size="lg" fw="bold">
            {fundingRecieved}
          </Text>
          <Text size="md">funding received in current round</Text>
        </div>
        <div className="">
          <Text size="lg" fw="bold">
            {getRemainingDays(daysLeft)}
          </Text>
          <Text size="md">Round status</Text>
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
