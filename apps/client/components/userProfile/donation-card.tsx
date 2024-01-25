'use client';

import { chain } from '@/lib/wagmi';
import { Badge, Button, Group, Input, NumberInput, Stack, Text } from '@mantine/core';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { prepareSendTransaction, sendTransaction, waitForTransaction } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { isAddress, parseEther } from 'viem';
import { useBalance } from 'wagmi';
import useAppUser from '../hooks/useAppUser';

export default function SendCard() {
  const { appUser } = useAppUser();
  const [recieverAddress, setRecieverAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const { wallet } = usePrivyWagmi();
  const [loading, setLoading] = useState(false);

  const { data: balance, refetch } = useBalance({
    address: wallet?.address as `0x${string}`,
  });
  useEffect(() => {
    if (!balance) {
      void refetch();
    }
  }, [balance]);

  const handleSend = async () => {
    setLoading(true);
    if (!isAddress(recieverAddress)) {
      toast.error('Invalid Address');
      setLoading(false);
      return;
    }
    if (!balance) {
      toast.error('Invalid Balance');
      setLoading(false);
      return;
    }

    if (parseEther(amount) > balance.value) {
      toast.error('Insufficient Balance');
      setLoading(false);
      return;
    }
    try {
      const config = await prepareSendTransaction({
        to: recieverAddress,
        value: parseEther(amount),
      });
      const { hash } = await sendTransaction(config);
      toast.promise(
        waitForTransaction({
          hash,
        }),
        {
          loading: 'Sending Transaction',
          success: 'Transaction Sent',
          error: 'Error Sending Transaction',
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      /* eslint-disable */
      toast.error(e.message);
    }
    setLoading(false);
  };

  return (
    <Group mt="sm" p="sm">
      {appUser && balance ? (
        <Stack>
          <Badge variant="light" radius="md">
            Address : {wallet?.address.slice(0, 6)}.....{wallet?.address.slice(-6)}
          </Badge>
          <Badge size="lg" color="green" radius="md">
            Balance : {balance.formatted} {balance.symbol}
          </Badge>
          {/* Total Amount Raised */}
          <Text>Network : {chain.name.toUpperCase()}</Text>
          <Input
            placeholder="Receiver Address"
            value={recieverAddress}
            onChange={(e) => {
              setRecieverAddress(e.currentTarget.value);
            }}
          />
          <NumberInput
            label=""
            placeholder="Enter amount"
            allowDecimal
            allowNegative={false}
            defaultValue={0}
            value={amount}
            max={parseInt(balance.value.toString() ?? '1000')}
            onChange={(value) => {
              setAmount(value.toString());
            }}
          />
          <Button
            disabled={!isAddress(recieverAddress) || loading}
            onClick={async () => {
              await handleSend();
            }}
          >
            Send
          </Button>
        </Stack>
      ) : null}
    </Group>
  );
}
