import { Badge, Card, Divider, Flex, Text } from '@mantine/core';
import { IconCurrencyEthereum } from '@tabler/icons-react';
import React from 'react';

interface AddressDataProps {
  address: string;
}

export default function ReceiverAddressCard({ address }: AddressDataProps) {
  return (
    <Card
      p="md"
      radius="md"
      shadow="md"
      withBorder
      className="flex flex-col justify-between lg:max-w-[300px] my-3 lg:my-0"
    >
      <Text fw="bold">All Time Donations Recieved</Text>
      <Text fw="bold" c="blue" className="lg:text-5xl md:4xl ">
        $500
      </Text>
      <Text size="sm" c="gray">
        Raised from{'  '}
        <span className="text-dark font-bold">80 </span>
        contributions
      </Text>

      <Text mt="md">Project Recipient Address</Text>
      <Divider />
      <Badge mt="md" color="gray" p="md">
        <Flex gap="md">
          <Text size="sm">{address}</Text>
          <IconCurrencyEthereum size={20} />
        </Flex>
      </Badge>
    </Card>
  );
}
