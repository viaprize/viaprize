/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
'use client';
import { TransactionToast } from '@/components/custom/transaction-toast';
import useAppUser from '@/components/hooks/useAppUser';
import { backendApi } from '@/lib/backend';
import { USDC } from '@/lib/constants';
import { prepareWritePortal, writePortal } from '@/lib/smartContract';
import type { ConvertUSD } from '@/lib/types';
import { formatDate, usdcSignType } from '@/lib/utils';
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
} from '@tabler/icons-react';
import { readContract } from '@wagmi/core';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'sonner';
import revalidate from 'utils/revalidate';
import { hexToSignature } from 'viem';
import { hashTypedData } from 'viem/utils';
import { useBalance, useWalletClient } from 'wagmi';

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
  image: string;
  slug: string;
  title: string;
}

function FundUsdcCard({
  contractAddress,
  prizeId,
  title,
  imageUrl,
  successUrl,
  cancelUrl,
  slug,
}: {
  contractAddress: string;
  prizeId: string;
  title: string;
  imageUrl: string;
  successUrl: string;
  cancelUrl: string;
  slug: string;
}) {
  const [sendLoading, setSendLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [value, setValue] = useState('');
  const router = useRouter();

  const getUsdcSignatureData = async () => {
    if (parseFloat(value) < 1) {
      throw new Error('Donation must be at least 1$');
    }
    const walletAddress = walletClient?.account.address;
    if (!walletAddress) {
      throw new Error('Please login to donate');
    }
    const amount = BigInt(parseFloat(value) * 1000000);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 100_000);
    const nonce = await readContract({
      abi: [
        {
          constant: true,
          inputs: [
            {
              name: 'owner',
              type: 'address',
            },
          ],
          name: 'nonces',
          outputs: [
            {
              name: '',
              type: 'uint256',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
      ] as const,
      address: USDC,
      functionName: 'nonces',
      args: [walletAddress],
    });

    const signData = {
      owner: walletClient?.account.address,
      spender: contractAddress,
      value: amount,
      nonce: BigInt(nonce),
      deadline: deadline,
    };

    return signData;
  };
  const donateUsingUsdc = async () => {
    try {
      setSendLoading(true);
      if (!walletClient) {
        throw new Error('Please login to donate');
      }
      const signData = await getUsdcSignatureData();

      const hash = hashTypedData(usdcSignType(signData) as any);

      const signature = await walletClient.signTypedData(usdcSignType(signData) as any);
      const rsv = hexToSignature(signature);

      const trxHash = await (
        await backendApi()
      ).wallet
        .prizeAddUsdcFundsCreate(contractAddress, {
          amount: parseInt(signData.value.toString()),
          deadline: parseInt(signData.deadline.toString()),
          r: rsv.r,
          hash: hash,
          s: rsv.s,
          v: parseInt(rsv.v.toString()),
        })
        .then((res) => res.data.hash);

      toast.success(<TransactionToast hash={trxHash} title="Transaction Successful" />, {
        duration: 6000,
      });

      await revalidate({ tag: slug });
      router.refresh();
      window.location.reload();
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- it will log message
      toast.error((e as any)?.message);
    } finally {
      setSendLoading(false);
    }
  };

  const donateUsingFiat = async () => {
    try {
      setSendLoading(true);
      const signedData = await getUsdcSignatureData();
      if (!walletClient) {
        throw new Error('Please login to donate');
      }
      const hash = hashTypedData(usdcSignType(signedData) as any);
      const signature = await walletClient.signTypedData(usdcSignType(signedData) as any);
      const { r, s, v } = hexToSignature(signature);
      const checkoutUrl = await fetch(
        'https://fxk2d1d3nf.execute-api.us-west-1.amazonaws.com/checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            checkoutMetadata: {
              contractAddress,
              backendId: prizeId,
              deadline: parseInt(signedData.deadline.toString()),
              amount: parseInt(signedData.value.toString()),
              ethSignedMessage: hash,
              v: parseInt(v.toString()),
              r: r,
              s: s,
              chainId: 8453,
            },
            title,
            imageUrl,
            successUrl,
            cancelUrl,
          }),
        },
      )
        .then((res) => res.json())
        .then((data) => data.checkoutUrl);

      console.log({ checkoutUrl });
      await revalidate({ tag: slug });
      router.refresh();
      router.replace(checkoutUrl);
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- it will log message
      toast.error((e as any)?.message);
    } finally {
      setSendLoading(false);
    }
  };
  return (
    <Stack my="md">

      <Text fw="sm">Your donation needs to be atleast $1</Text>
      <NumberInput
        placeholder="Enter Value in $ To Donate"
        mt="md"
        allowDecimal
        defaultValue={1}
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
          await donateUsingUsdc();
        }}
      >
        Donate
      </Button>

      <Button
        disabled={!value}
        loading={sendLoading}
        onClick={async () => {
          await donateUsingFiat();
        }}
      >
        Donate With Card
      </Button>
    </Stack>
  );
}
// function DonateButton({
//   value,
//   refetch,
//   sendLoading,
//   setSendLoading,
//   contractAddress,
//   cryptoToUsd,
//   balance,
//   setValue,
//   isLoading,
//   ethOfDonateValue,
//   debounced,
// }: {
//   isLoading: boolean;
//   balance: FetchBalanceResult | undefined;
//   value: string;
//   ethOfDonateValue: number;
//   sendLoading: boolean;
//   setSendLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   contractAddress: string;
//   setValue: React.Dispatch<React.SetStateAction<string>>;
//   cryptoToUsd: ConvertUSD | undefined;
//   refetch: any;
//   debounced: string;
// }) {
//   return (
//     <>
//       <NumberInput
//         description={
//           isLoading
//             ? 'Loading.....'
//             : `Wallet Balance: ${
//                 balance
//                   ? `$${(
//                       parseFloat(balance.formatted.toString()) *
//                       (cryptoToUsd?.ethereum.usd ?? 0)
//                     ).toFixed(2)} (${parseFloat(balance.formatted).toFixed(3)} ${
//                       balance.symbol
//                     })`
//                   : `Login To See Balance`
//               }`
//         }
//         placeholder="Enter Value  in $ To Donate"
//         mt="md"
//         label={`You will donate ${value} USD (${ethOfDonateValue.toFixed(4) ?? 0} ${
//           chain.nativeCurrency.symbol
//         })`}
//         rightSection={
//           <ActionIcon>
//             <IconRefresh onClick={() => refetch({})} />
//           </ActionIcon>
//         }
//         max={parseInt(balance?.formatted ?? '0')}
//         allowDecimal
//         defaultValue={0}
//         allowNegative={false}
//         value={value}
//         onChange={(v) => {
//           if (!v) {
//             // console.log({ v }, 'inner v');
//             setValue('0');
//           }
//           setValue(v.toString());
//         }}
//       />

//       <Button
//         disabled={!value}
//         loading={sendLoading}
//         onClick={async () => {
//           await refetch();

//           setSendLoading(true);

//           try {
//             const config = await prepareSendTransaction({
//               to: contractAddress,
//               value: debounced ? parseEther(ethOfDonateValue.toString()) : undefined,
//               data: '0x',
//             });
//             const { hash } = await sendTransaction(config);
//             toast.success(
//               <div className="flex items-center ">
//                 <IconCircleCheck />{' '}
//                 <Text fw="md" size="sm" className="ml-2">
//                   {' '}
//                   Transaction successfull
//                 </Text>
//                 <Link
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   href={`https://optimistic.etherscan.io/tx/${hash}`}
//                 >
//                   <Button variant="transparent" className="text-blue-400 underline">
//                     See here
//                   </Button>
//                 </Link>
//               </div>,
//               {
//                 duration: 6000,
//               },
//             );

//             window.location.reload();
//           } catch (e: unknown) {
//             toast.error((e as any)?.message);
//           } finally {
//             setSendLoading(false);
//           }
//         }}
//       >
//         Donate
//       </Button>
//     </>
//   );
// }
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
  slug,
  image,
  title,
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

  const params = useParams();

  useEffect(() => {
    if (window.location.hash.includes('success')) {
      fetch('https://fxk2d1d3nf.execute-api.us-west-1.amazonaws.com/reserve/hash').then(
        (res) => {
          res.json().then((data) => {
            toast.success(
              <TransactionToast hash={data.hash} title="Transaction Successful" />,
              {
                 
              closeButton: true,
              },
            );
          });
        },
      );
    }
  }, [params]);

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
              <>${parseFloat(amountRaised).toFixed(2)} USD</>
            </>
          )}
        </Text>
        <Text c="blue" className="lg:text-3xl md:text-2xl text-sm"></Text>
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
            {/* <Badge color="red" variant="light" radius="md" my="sm" size="lg">
              Donation only on OP Mainnet !
            </Badge> */}
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
          <FundUsdcCard
            cancelUrl={window.location.href}
            contractAddress={contractAddress}
            imageUrl={image}
            prizeId={id}
            slug={slug}
            successUrl={`${window.location.href}#success`}
            title={title}
          />
        )}
        {wallet?.address && treasurers.includes(wallet?.address) && sendImmediately ? (
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const hash = await (
                  await backendApi()
                ).wallet.fundRaisersEndCampaignCreate(contractAddress);
                toast.success(
                  <TransactionToast
                    hash={hash.data.hash}
                    title="Campaign ended successfully"
                  />,
                );
                window.location.reload();
              } catch (e: unknown) {
                toast.error((e as any)?.message);
              } finally {
                setSendLoading(false);
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
                const hash = await (
                  await backendApi()
                ).wallet.fundRaisersEndCampaignCreate(contractAddress);
                toast.success(
                  <TransactionToast
                    hash={hash.data.hash}
                    title="Campaign ended successfully"
                  />,
                );
                window.location.reload();
              } catch (e: unknown) {
                toast.error((e as any)?.message);
              } finally {
                setSendLoading(false);
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
