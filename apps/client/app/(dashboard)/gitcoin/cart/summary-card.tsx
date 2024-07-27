'use client';
import { FUND_MCR_ADDRESS, USDC } from '@/lib/constants';
import { encodedQFAllocation, usdcSignType } from '@/lib/utils';
import { getTokenByChainIdAndAddress } from '@gitcoin/gitcoin-chain-data';
import { Card, Divider, Text } from '@mantine/core';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { readContract } from '@wagmi/core';
import { useCartStore } from 'app/(dashboard)/(_utils)/store/datastore';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { encodeFunctionData, hashTypedData, Hex, hexToSignature, parseUnits } from 'viem';
import { useWalletClient } from 'wagmi';
export default function SummaryCard() {
  const { data: walletClient } = useWalletClient();
  const router = useRouter();
  const { items } = useCartStore();
  const totalAmount = useMemo(
    () => items.reduce((acc, item) => acc + parseFloat(item.amount), 0),
    [items],
  );
  const sumbit = async () => {
    if (!walletClient) {
      throw new Error('Wallet client not found');
    }
    const walletAddress = walletClient.account.address;
    const projectsByChain = {
      [8453]: items,
    };

    const mcqAddress = '0x7C24f3494CC958CF268a92b45D7e54310d161794';
    const usdcToken = getTokenByChainIdAndAddress(8453, USDC);
    const deadline = Math.floor(Date.now() / 1000) + 100_000;
    const totalDonationInUSDCOnChain = totalAmount * 1_000_000;

    const chainId = 8453;
    const donations = projectsByChain[chainId];

    let sig;

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

    const hash = hashTypedData(
      usdcSignType({
        deadline: BigInt(deadline),
        nonce: nonce,
        owner: walletAddress,
        spender: mcqAddress,
        value: BigInt(totalDonationInUSDCOnChain),
      }) as any,
    );

    const signature = await walletClient.signTypedData(
      usdcSignType({
        deadline: BigInt(deadline),
        nonce: nonce,
        owner: walletAddress,
        spender: mcqAddress,
        value: BigInt(totalDonationInUSDCOnChain),
      }) as any,
    );

    const rsv = hexToSignature(signature);

    const groupedDonationsByRoundId = Object.groupBy(
      donations.map((d) => ({
        ...d,
        roundId: d.roundId,
      })),
      ({ roundId }) => roundId,
    );

    const groupedEncodedVotes: Record<string, Hex[]> = {};
    if (!groupedDonationsByRoundId) {
      throw new Error('groupedDonationsByRoundId is null');
    }
    for (const roundId in groupedDonationsByRoundId) {
      if (!groupedDonationsByRoundId[roundId]) {
        throw new Error('groupedDonationsByRoundId[roundId] is null');
      }
      groupedEncodedVotes[roundId] = encodedQFAllocation(
        usdcToken,
        // @ts-ignore: Object is possibly 'null'.
        groupedDonationsByRoundId![roundId].map((d) => ({
          anchorAddress: d.anchorAddress ?? '',
          amount: d.amount,
        })),
      );
    }
    // const groupedAmounts: Record<string, bigint> = {};
    // for (const roundId in groupedDonationsByRoundId) {
    //   if (!groupedDonationsByRoundId[roundId]) {
    //     continue;
    //   }
    //   groupedAmounts[roundId] = groupedDonationsByRoundId[roundId].reduce(
    //     (acc, donation) => acc + parseUnits(donation.amount, usdcToken.decimals),
    //     BigInt(0),
    //   );
    // }
    const amountArray: bigint[] = [];
    for (const roundId in groupedDonationsByRoundId) {
      if (!groupedDonationsByRoundId[roundId]) {
        continue;
      }
      // @ts-ignore: Object is possibly 'null'.
      groupedDonationsByRoundId[roundId].map((donation) => {
        amountArray.push(parseUnits(donation.amount, usdcToken.decimals));
      });
    }
    const poolIds = Object.keys(groupedEncodedVotes).flatMap((key) => {
      const count = groupedEncodedVotes[key].length;
      return new Array(count).fill(key);
    });
    const data = Object.values(groupedEncodedVotes).flat();

    const rawTxData = encodeFunctionData({
      abi: FUND_MCR_ADDRESS,
      functionName: 'fundUsingUsdc',
      args: [
        '0xF7D1D901d15BBf60a8e896fbA7BBD4AB4C1021b3',
        mcqAddress,
        hash,
        data,
        poolIds,
        Object.values(amountArray),
        Object.values(amountArray).reduce((acc, b) => acc + b),
        usdcToken.address as Hex,
        BigInt(deadline),
        parseInt(rsv.v.toString()),
        rsv.r as Hex,
        rsv.s as Hex,
      ],
    });

    try {
      const checkoutUrl = await fetch(
        'https://fxk2d1d3nf.execute-api.us-west-1.amazonaws.com/checkout/paypal',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metadata: rawTxData,
            customId: nanoid(),
            amount: totalAmount,
          }),
        },
      )
        .then((res) => res.json())
        .then((data) => data);

      console.log({ checkoutUrl });

      return checkoutUrl.id as string;
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- it will log message
      toast.error((e as any)?.message);
    } finally {
      // setSendLoading(false);
    }
  };

  return (
    <Card className="lg:w-[40%] lg:h-[60%] w-full p-4 space-y-2">
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
          ${totalAmount}
        </Text>
      </div>
      <Divider />
      {/* <Button onClick={sumbit}>Pay With Card</Button> */}
      <PayPalScriptProvider
        options={{
          clientId:
            'ARWRaruLPRFS3ekuyixocUzPBxKUEacRHjzVR5HP-1lLJS-Fj0BJkHZ_CmA-OlQsicXGenwgOqMnYAqs',
        }}
      >
        <PayPalButtons
          style={{ layout: 'horizontal' }}
          createOrder={async () => {
            const id = await sumbit();
            if (!id) {
              throw new Error('Checkout ID not found');
            }
            return id;
          }}
          onApprove={(data) => {
            return fetch(
              'https://fxk2d1d3nf.execute-api.us-west-1.amazonaws.com/checkout/paypal/capture',
              {
                method: 'POST',

                body: JSON.stringify({
                  orderId: data.orderID,
                }),
              },
            )
              .then((response) => response.json())
              .then((orderData) => {
                const name = orderData.payer.name.given_name;
                alert(`Transaction completed by ${name}`);
              });
          }}
        />
      </PayPalScriptProvider>
    </Card>
  );
}
