'use client';
import useAppUser from '@/context/hooks/useAppUser';
import { prepareWritePortal, writePortal } from '@/lib/smartContract';
import { formatDate } from '@/lib/utils';
import { chain } from '@/lib/wagmi';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CopyButton,
  Divider,
  Flex,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCheck, IconCopy, IconRefresh } from '@tabler/icons-react';
import { prepareSendTransaction, sendTransaction } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';

interface AmountDonateCardProps {
  amountRaised: string;
  totalContributors: string;
  recipientAddress: string;
  contractAddress: string;
  fundingGoal: number;
  treasurers: string[];
  typeOfPortal: string;
  deadline?: string;
  isActive: boolean;
  sendImmediately: boolean;
}

export default function AmountDonateCard({
  recipientAddress,
  amountRaised,
  totalContributors,
  contractAddress,
  fundingGoal,
  typeOfPortal,
  deadline,
  treasurers,
  sendImmediately,
  isActive,
}: AmountDonateCardProps) {
  const { address } = useAccount();
  const [value, setValue] = useState('');
  const [debounced] = useDebouncedValue(value, 500);
  const { appUser } = useAppUser();

  const { data: balance, isLoading, refetch } = useBalance({ address });
  console.log({ balance }, 'balance');

  useEffect(() => {
    if (!balance) {
      void refetch();
    }
  }, [balance]);

  const [sendLoading, setSendLoading] = useState(false);
  return (
    <Card
      p="md"
      radius="md"
      shadow="md"
      withBorder
      className="flex flex-col justify-between w-full lg:max-w-[350px] my-3 lg:my-0"
    >
      <div>
        <Badge color="gray" variant="light" radius="sm" mb="sm">
          Total Amount Raised
        </Badge>
        <Text fw="bold" c="blue" className="lg:text-4xl md:text-3xl text-lg">
          {amountRaised} {chain.nativeCurrency.symbol}
        </Text>

        <Text fw="bold" size="xl">
          {isActive ? 'Accepting Donation' : 'Not Accepting Donations'}
        </Text>
        {/* <Text size="sm">
          Raised from{'  '}
          <span className="text-dark font-bold">{totalContributors}</span> contributions
        </Text> */}
        <Badge color="gray" variant="light" radius="sm">
          {typeOfPortal}
        </Badge>

        {deadline && (
          <Text size="xs" mt="xs">
            Deadline: {formatDate(deadline)}
          </Text>
        )}

        {fundingGoal !== 0 ? (
          <Badge size="md" my="md" radius="md">
            Funding Goal: {fundingGoal} {chain.nativeCurrency.symbol}
          </Badge>
        ) : null}
        {/* <Text className="border-2 rounded-lg mt-2 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatibus,
          quas, quae, quos voluptatem amet voluptatum dolorum
        </Text> */}
      </div>
      <div>
        <Text>
          Project Donation Address{' '}
          <CopyButton value={recipientAddress}>
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
        </Text>
        <Flex></Flex>
        <Text size="sm" my={'sm'}>
          {recipientAddress}
        </Text>

        <Divider my="sm" />
      </div>

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
              : `Enter Value To Donate (Max: ${
                  balance ? `${balance.formatted} ${balance.symbol}` : `Login To See Max`
                }  )`
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
        {address && treasurers.includes(address) && sendImmediately ? (
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const config = await prepareWritePortal({
                  functionName: 'endCampaign',
                  address: contractAddress as `0x${string}`,
                });

                const { hash } = await writePortal(config);
                toast.success(`Transaction ${hash}`, {
                  duration: 6000,
                });
              } catch (e: unknown) {
                toast.error((e as any)?.message);
              } finally {
                setSendLoading(false);
                window.location.reload();
              }
            }}
          >
            End Campaign
          </Button>
        ) : null}
        {address &&
        isActive &&
        (treasurers.includes(address) || appUser?.isAdmin) &&
        !sendImmediately ? (
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const config = await prepareWritePortal({
                  functionName: 'endEarlyandRefund',
                  address: contractAddress as `0x${string}`,
                });

                const { hash } = await writePortal(config);
                toast.success(`Transaction ${hash}`, {
                  duration: 6000,
                });
              } catch (e: unknown) {
                toast.error((e as any)?.message);
              } finally {
                setSendLoading(false);
                window.location.reload();
              }
            }}
          >
            Refund and End Campaign Early
          </Button>
        ) : null}
        {address &&
        deadline &&
        isActive &&
        new Date(deadline) < new Date() &&
        (treasurers.includes(address) || appUser?.isAdmin) &&
        !sendImmediately ? (
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const config = await prepareWritePortal({
                  functionName: 'endKickStarterCampaign',
                  address: contractAddress as `0x${string}`,
                });

                const { hash } = await writePortal(config);
                toast.success(`Transaction ${hash}`, {
                  duration: 6000,
                });
              } catch (e: unknown) {
                toast.error((e as any)?.message);
              } finally {
                setSendLoading(false);
                window.location.reload();
              }
            }}
          >
            End Campaign
          </Button>
        ) : null}
      </Stack>
    </Card>
  );
}
