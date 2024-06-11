'use client';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import { ActionIcon, Badge, CopyButton, Divider, Flex, Text, Title } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

export default function AboutPrize({
  amount,
  description,
  contractAddress,
}: {
  amount: string;
  description: string;
  contractAddress: string;
}) {
  return (
    <div className="w-full mt-4 min-w-0">
      <Flex direction={'column'} gap={'sm'} justify={'center'}>
        <Badge color="gray" variant="light" radius="sm" mb="sm">
          Total Amount Raised
        </Badge>
        <Text fw="bold" c="blue" className="lg:text-4xl md:text-3xl text-lg">
          {parseFloat(amount) / 1000000} USD
        </Text>
      </Flex>
      <div className="py-4">
        <Title order={4} className="mb-2">
          About the prize
        </Title>
        {/* <Title order={6}>
          Contract Address on {chain.name.toUpperCase()} (You can donate to this address
          also): {contractAddress}
        </Title> */}
        <div className="sm:flex  gap-4 items-start">
          <div>
            <Text>Project Donation Address </Text>
            <Flex align="center">
              <Badge size="lg" variant="light" color="primary.2" my="sm">
                {contractAddress.slice(0, 8)}........{contractAddress.slice(-5)}
              </Badge>
              <CopyButton value={contractAddress}>
                {({ copied, copy }) => (
                  <ActionIcon
                    ml="md"
                    onClick={copy}
                    style={{
                      backgroundColor: copied ? '#3d4070' : '#3d4070',
                    }}
                  >
                    {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                  </ActionIcon>
                )}
              </CopyButton>
            </Flex>
          </div>
          <Badge
            color="red"
            variant="light"
            radius="md"
            size="lg"
            className="sm:my-0 my-4"
          >
            Donation only on OP Mainnet !
          </Badge>
          <Divider my="sm" />
        </div>
        <TextEditor disabled richtext={description} />
      </div>
    </div>
  );
}
