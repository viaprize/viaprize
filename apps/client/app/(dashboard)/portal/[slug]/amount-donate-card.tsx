/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
'use client';
import useAppUser from '@/components/hooks/useAppUser';
import { backendApi } from '@/lib/backend';
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
  NavLink,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import {
  IconCheck,
  IconChevronRight,
  IconCircleCheck,
  IconCopy,
  IconRefresh,
} from '@tabler/icons-react';
import type { FetchBalanceResult } from '@wagmi/core';
import { prepareSendTransaction, sendTransaction } from '@wagmi/core';
import Link from 'next/link';
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
  id: string;
}

function DonateButton({
  value,
  refetch,
  sendLoading,
  setSendLoading,
  contractAddress,
  cryptoToUsd,
  balance,
  setValue,
  isLoading,
  ethOfDonateValue,
  debounced,
}: {
  isLoading: boolean;
  balance: FetchBalanceResult | undefined;
  value: string;
  ethOfDonateValue: number;
  sendLoading: boolean;
  setSendLoading: React.Dispatch<React.SetStateAction<boolean>>;
  contractAddress: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  cryptoToUsd: ConvertUSD | undefined;
  refetch: any;
  debounced: string;
}) {
  return (
    <>
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
              }`
        }
        placeholder="Enter Value  in $ To Donate"
        mt="md"
        label={`You will donate ${value} USD (${ethOfDonateValue.toFixed(4) ?? 0} ${
          chain.nativeCurrency.symbol
        })`}
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
            toast.success(
              <div className="flex items-center ">
                <IconCircleCheck />{' '}
                <Text fw="md" size="sm" className="ml-2">
                  {' '}
                  Transaction successfull
                </Text>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://optimistic.etherscan.io/tx/${hash}`}
                >
                  <Button variant="transparent" className="text-blue-400 underline">
                    See here
                  </Button>
                </Link>
              </div>,
              {
                duration: 6000,
              },
            );

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
    </>
  );
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
  id,
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

  const { data: extraData } = useQuery(['get-extra-data'], async () => {
    const final = (await backendApi(false)).portals.extraDataDetail(id);
    return final;
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
    const cryptoToUsdValue = cryptoToUsd.ethereum.usd;
    const usdToEth = parseFloat(value) / cryptoToUsdValue;
    return isNaN(usdToEth) ? 0 : usdToEth;
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
          {id === 'bacb6584-7e45-465b-b4af-a3ed24a84233' ? (
            <>
              {cryptoToUsd ? (
                <>
                  $
                  {(
                    parseFloat(amountRaised) * cryptoToUsd.ethereum.usd +
                    parseInt(extraData?.data.funds.toString() ?? '0')
                  ).toFixed(2)}{' '}
                  USD
                </>
              ) : null}
            </>
          ) : (
            <>
              {cryptoToUsd ? (
                <>
                  ${(parseFloat(amountRaised) * cryptoToUsd.ethereum.usd).toFixed(2)} USD
                </>
              ) : null}
            </>
          )}
        </Text>
        <Text c="blue" className="lg:text-3xl md:text-2xl text-sm">
          {id === 'bacb6584-7e45-465b-b4af-a3ed24a84233' ? null : (
            <>
              {parseFloat(amountRaised).toPrecision(4)} {chain.nativeCurrency.symbol}
            </>
          )}
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
        {id !== 'bacb6584-7e45-465b-b4af-a3ed24a84233' && (
          <>
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
          </>
        )}
      </div>
      <Stack my="md">
        {/* <NumberInput
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
                      }`
                    : `Login To See Balance`
                })`
          }
          placeholder="Enter Value  in $ To Donate"
          mt="md"
          label={`You will donate ${value} USD (${ethOfDonateValue.toFixed(4) ?? 0}) ${
            chain.nativeCurrency.symbol
          } `}
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
        </Button> */}
        {id === 'bacb6584-7e45-465b-b4af-a3ed24a84233' ? (
          <>
            <Link
              href="https://buy.stripe.com/00g8x6dwf7M8gHm7st"
              className="hover:text-blue-400"
            />
            <NavLink
              href="https://buy.stripe.com/00g8x6dwf7M8gHm7st"
              label="Donate monthly"
              rightSection={
                <IconChevronRight
                  size="0.8rem"
                  stroke={1.5}
                  className="mantine-rotate-rtl"
                />
              }
              variant="filled"
              active
            />

            <Link
              href="https://donate.stripe.com/14k00A0Jt8QcfDibII"
              className="hover:text-blue-400"
            />
            <NavLink
              href="https://donate.stripe.com/14k00A0Jt8QcfDibII"
              label="One time donation with card"
              rightSection={
                <IconChevronRight
                  size="0.8rem"
                  stroke={1.5}
                  className="mantine-rotate-rtl"
                />
              }
              variant="filled"
              active
            />
          </>
        ) : (
          <DonateButton
            balance={balance}
            value={value}
            ethOfDonateValue={ethOfDonateValue}
            sendLoading={sendLoading}
            setSendLoading={setSendLoading}
            contractAddress={contractAddress}
            cryptoToUsd={cryptoToUsd}
            refetch={refetch}
            debounced={debounced}
            isLoading={isLoading}
            setValue={setValue}
          />
        )}
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
                toast.success(
                  <div className="flex items-center ">
                    <IconCircleCheck />{' '}
                    <Text fw="md" size="sm" className="ml-2">
                      {' '}
                      Campaign ended successfully
                    </Text>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://optimistic.etherscan.io/tx/${hash}`}
                    >
                      <Button variant="transparent" className="text-blue-400 underline">
                        See here
                      </Button>
                    </Link>
                  </div>,
                  {
                    duration: 6000,
                  },
                );
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
                toast.success(
                  <div className="flex items-center ">
                    <IconCircleCheck />{' '}
                    <Text fw="md" size="sm" className="ml-2">
                      {' '}
                      Campaign ended and refunded successfully
                    </Text>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://optimistic.etherscan.io/tx/${hash}`}
                    >
                      <Button variant="transparent" className="text-blue-400 underline">
                        See here
                      </Button>
                    </Link>
                  </div>,
                  {
                    duration: 6000,
                  },
                );
              } catch (e: unknown) {
                toast.error((e as any)?.message);
              } finally {
                setSendLoading(false);
                window.location.reload();
              }
            }}
          >
            Refund And End Campaign Early
          </Button>
        ) : null}
        {wallet?.address &&
        isActive &&
        (treasurers.includes(wallet?.address) || appUser?.isAdmin) &&
        !sendImmediately &&
        parseInt(amountRaised) >= fundingGoalWithPlatformFee ? (
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const config = await prepareWritePortal({
                  functionName: 'endKickStarterCampaign',
                  address: contractAddress as `0x${string}`,
                });

                const { hash } = await writePortal(config);
                toast.success(
                  <div className="flex items-center ">
                    <IconCircleCheck />{' '}
                    <Text fw="md" size="sm" className="ml-2">
                      {' '}
                      Campaign ended successfully
                    </Text>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://optimistic.etherscan.io/tx/${hash}`}
                    >
                      <Button variant="transparent" className="text-blue-400 underline">
                        See here
                      </Button>
                    </Link>
                  </div>,
                  {
                    duration: 6000,
                  },
                );
              } catch (e: unknown) {
                toast.error((e as any)?.message);
              } finally {
                setSendLoading(false);
                window.location.reload();
              }
            }}
          >
            Collect Funds and End Campaign Early
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
                toast.success(
                  <div className="flex items-center ">
                    <IconCircleCheck />{' '}
                    <Text fw="md" size="sm" className="ml-2">
                      {' '}
                      Campaign ended successfully
                    </Text>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://optimistic.etherscan.io/tx/${hash}`}
                    >
                      <Button variant="transparent" className="text-blue-400 underline">
                        See here
                      </Button>
                    </Link>
                  </div>,
                  {
                    duration: 6000,
                  },
                );
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
