import { Button, Card, Divider, Text } from '@mantine/core';

export default function SummaryCard() {
  return (
    <Card className="lg:w-[40%] w-full p-4 space-y-2">
      <Text size="lg" fw="bold">
        Summary
      </Text>
      <Divider />
      <div className="flex items-center justify-between">
        <div className="">
          <Text>Your total contribution to </Text>
          <Text c="blue">Gitcoin</Text>
        </div>
        <Text fw="bold" size="lg">
          $0.00
        </Text>
      </div>
      <Divider />
      <Button>Pay With Card</Button>
    </Card>
  );
}
