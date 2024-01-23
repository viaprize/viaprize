'use client';
import useAppUser from '@/components/hooks/useAppUser';
import { prepareWritePortal, writePortal } from '@/lib/smartContract';
import type { ConvertUSD } from '@/lib/types';
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
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { IconCheck, IconCopy, IconRefresh } from '@tabler/icons-react';
import { prepareSendTransaction, sendTransaction } from '@wagmi/core';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useBalance } from 'wagmi';

interface AmountDonateCardProps {
  amountRaised: string;
  totalContributors: string;
  recipientAddress: string;
  contractAddress: string;
  fundingGoalWithPlatformFee: number;
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
  fundingGoalWithPlatformFee,
  typeOfPortal,
  deadline,
  treasurers,
  sendImmediately,
  isActive,
}: AmountDonateCardProps) {
  const [value, setValue] = useState('');
  const [debounced] = useDebouncedValue(value, 500);
  const { appUser } = useAppUser();
  const { wallet } = usePrivyWagmi();

  const {
    data: balance,
    refetch,
    isLoading,
  } = useBalance({
    address: wallet?.address as `0x${string}`,
  });

  console.log({ balance }, 'balance');

  const { data: cryptoToUsd } = useQuery<ConvertUSD>(['get-crypto-to-usd'], async () => {
    const final = await (
      await fetch(`https://api-prod.pactsmith.com/api/price/usd_to_eth`)
    ).json();
    return Object.keys(final).length === 0
      ? {
          [chain.name.toLowerCase()]: {
            usd: 0,
          },
        }
      : final;
  });

  useEffect(() => {
    if (!balance) {
      void refetch();
    }
  }, [balance]);

  const ethOfDonateValue = useMemo(() => {
    if (!cryptoToUsd) {
      console.error('cryptoToUsd is undefined');
      return 0;
    }
    const cryto_to_usd_value = cryptoToUsd.ethereum.usd;
    const usd_to_eth = parseFloat(value) / cryto_to_usd_value;
    return isNaN(usd_to_eth) ? 0 : usd_to_eth;
  }, [value]);

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
          {cryptoToUsd ? (
            <>${(parseFloat(amountRaised) * cryptoToUsd.ethereum.usd).toFixed(2)} USD</>
          ) : null}
        </Text>
        <Text c="blue" className="lg:text-3xl md:text-2xl text-sm">
          ({parseFloat(amountRaised).toPrecision(4)} {chain.nativeCurrency.symbol} )
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
        {deadline ? (
          <Text size="xs" mt="xs">
            Deadline: {formatDate(deadline)}
          </Text>
        ) : null}
        {fundingGoalWithPlatformFee !== 0 && cryptoToUsd ? (
          <Badge size="md" my="md" radius="md">
            Funding Goal:{' '}
            {(fundingGoalWithPlatformFee * cryptoToUsd.ethereum.usd).toFixed(2)} USD (
            {fundingGoalWithPlatformFee} {chain.nativeCurrency.symbol})
          </Badge>
        ) : null}
        {/* <Text className="border-2 rounded-lg mt-2 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatibus,
          quas, quae, quos voluptatem amet voluptatum dolorum
        </Text> */}
      </div>
      <div>
        <Text>Project Donation Address </Text>
        <Flex align="center">
          <Badge size="lg" variant="light" color="primary.2" my="sm">
            {recipientAddress.slice(0, 8)}........{recipientAddress.slice(-5)}
          </Badge>
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
        </Flex>
        <Badge color="red" variant="light" radius="md" my="sm" size="lg">
          Donation only on OP Mainnet !
        </Badge>
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
          description={
            isLoading
              ? 'Loading.....'
              : `Wallet Balance: ${
                  balance
                    ? `$${(
                        parseFloat(balance.formatted.toString()) *
                        (cryptoToUsd?.ethereum.usd ?? 0)
                      ).toFixed(2)} (${parseFloat(balance.formatted).toFixed(3)} ${
                        balance.symbol
                      })`
                    : `Login To See Balance`
                })`
          }
          placeholder="Enter Value  in $ To Donate"
          mt="md"
          label={`You will donate ${ethOfDonateValue.toFixed(4) ?? 0} ${
            chain.nativeCurrency.symbol
          } (${value} USD)`}
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

            setSendLoading(true);

            try {
              const config = await prepareSendTransaction({
                to: contractAddress,
                value: debounced ? parseEther(ethOfDonateValue.toString()) : undefined,
                data: '0x',
              });
              const { hash } = await sendTransaction(config);
              toast.success(`Transaction ${hash}`, {
                duration: 6000,
              });

              window.location.reload();
            } catch (e: unknown) {
              toast.error((e as any)?.message);
            } finally {
              setSendLoading(false);
            }
          }}
        >
          Donate
        </Button>
        {wallet?.address && treasurers.includes(wallet?.address) && sendImmediately ? (
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
        {wallet?.address &&
        isActive &&
        (treasurers.includes(wallet?.address) || appUser?.isAdmin) &&
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
        {wallet?.address &&
        deadline &&
        isActive &&
        new Date(deadline) < new Date() &&
        (treasurers.includes(wallet?.address) || appUser?.isAdmin) &&
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
