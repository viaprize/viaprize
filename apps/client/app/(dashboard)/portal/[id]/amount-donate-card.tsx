'use client';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCurrencyEthereum, IconRefresh } from '@tabler/icons-react';
import { prepareSendTransaction, sendTransaction } from '@wagmi/core';
import { useState } from 'react';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';

interface AmountDonateCardProps {
  amountRaised: string;
  totalContributors: string;
  recipientAddress: string;
  contractAddress: string;
}

export default function AmountDonateCard({
  recipientAddress,
  amountRaised,
  totalContributors,
  contractAddress,
}: AmountDonateCardProps) {
  const { address } = useAccount();
  const [value, setValue] = useState('');
  const [debounced] = useDebouncedValue(value, 500);

  const { data: balance, isLoading, refetch } = useBalance({ address });

  const [sendLoading, setSendLoading] = useState(false);
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
      <Text>Project Recipient Address</Text>
      <Divider />
      <Badge color="gray" p="md">
        <Flex gap="md">
          <Text size="sm">
            {recipientAddress.slice(0, 5)}....{recipientAddress.slice(-5)}
          </Text>
          <IconCurrencyEthereum size={20} />
        </Flex>
      </Badge>

      {/* // const { isLoading: sendLoading, sendTransaction } = useSendTransaction({
  //   ...config,
  //   async onSuccess(data) {
  //     toast.success(`Transaction Sent with Hash ${data?.hash}`, {
  //       duration: 6000,
  //     });
  //     await refetch();
  //   },
  // }); */}

      <Stack my="md">
        <NumberInput
          label={
            isLoading
              ? 'Loading.....'
              : `Enter Value To Donate (Max: ${balance?.formatted} ${balance?.symbol} )`
          }
          placeholder="Custom right section"
          mt="md"
          rightSection={
            <ActionIcon>
              <IconRefresh onClick={() => refetch({})} />
            </ActionIcon>
          }
          max={parseInt(balance?.formatted ?? '0')}
          allowDecimal
          defaultValue={0}
          allowNegative={false}
          value={value}
          onChange={(v) => {
            if (!v) {
              // console.log({ v }, 'inner v');
              setValue('0');
            }
            setValue(v.toString());
          }}
        />

        <Button
          disabled={!value}
          loading={sendLoading}
          onClick={async () => {
            await refetch();

            if (parseInt(debounced.toString()) > parseInt(balance?.formatted ?? '0')) {
              toast.error('Insufficient Balance');
              return;
            }
            setSendLoading(true);

            const config = await prepareSendTransaction({
              to: contractAddress,
              value: debounced ? parseEther(debounced) : undefined,
            });

            const { hash } = await sendTransaction(config);
            toast.success(`Transaction ${hash}`, {
              duration: 6000,
            });
            setSendLoading(false);
            window.location.reload();
          }}
        >
          Donate
        </Button>
      </Stack>
    </Card>
  );
}
