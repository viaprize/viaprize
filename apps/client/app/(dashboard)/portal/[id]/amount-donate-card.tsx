import { Badge, Button, Card, Divider, Text } from '@mantine/core';
import CopyDetails from './copy-details';

interface AmountDonateCardProps {
  amountRaised: string;
  totalContributors: string;
  recipientAddress: string;
}

export default function AmountDonateCard({
  recipientAddress,
  amountRaised,
  totalContributors,
}: AmountDonateCardProps) {
  return (
    <Card
      p="md"
      radius="md"
      shadow="md"
      withBorder
      className="flex flex-col justify-between w-full lg:max-w-[300px] my-3 lg:my-0"
    >
      <div>
        <Badge color="gray" variant="light" radius="sm" mb="sm">
          Total Amount Raised
        </Badge>
        <Text fw="bold" c="blue" className="lg:text-5xl md:4xl ">
          {amountRaised} Matic
        </Text>
        <Text size="sm">
          Raised from{'  '}
          <span className="text-dark font-bold">{totalContributors}</span> contributions
        </Text>
        {/* <Text className="border-2 rounded-lg mt-2 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatibus,
          quas, quae, quos voluptatem amet voluptatum dolorum
        </Text> */}
      </div>
      <div className="flex flex-col gap-2">
        <Text>Project Recipient Address</Text>
        <Divider />
        <CopyDetails recipientAddress={recipientAddress} />
      </div>
      <Button color="primary">Donate</Button>
    </Card>
  );
}
