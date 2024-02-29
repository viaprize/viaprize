'use client';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import { ConvertUSD } from '@/lib/types';
import { chain } from '@/lib/wagmi';
import { ActionIcon, Badge, CopyButton, Divider, Flex, Text, Title } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useQuery } from 'wagmi';

export default function AboutPrize({
  amount,
  description,
  contractAddress,
}: {
  amount: string;
  description: string;
  contractAddress: string;
}) {
  const { data: cryptoToUsd } = useQuery<ConvertUSD>(['get-crypto-to-usd'], async () => {
    const final = await (
      await fetch(`https://api-prod.pactsmith.com/api/price/usd_to_eth`)
    ).json();
    return Object.keys(final).length === 0
      ? {
          ethereum: {
            usd: 0,
          },
        }
      : final;
  });
  return (
    <div className="w-full mt-4 min-w-0">
      <Flex direction={'column'} gap={'sm'} justify={'center'}>
        <Badge color="gray" variant="light" radius="sm" mb="sm">
          Total Amount Raised
        </Badge>
        <Text fw="bold" c="blue" className="lg:text-4xl md:text-3xl text-lg">
          {cryptoToUsd ? (
            <>${(parseFloat(amount) * cryptoToUsd.ethereum.usd).toFixed(2)} USD</>
          ) : null}
        </Text>
        <Text c="blue" className="lg:text-3xl md:text-2xl text-sm">
          ({parseFloat(amount).toPrecision(4)} {chain.nativeCurrency.symbol} )
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
