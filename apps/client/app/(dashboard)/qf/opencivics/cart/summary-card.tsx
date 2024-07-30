'use client';
import { Card, Divider, Text } from '@mantine/core';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useCartStore } from 'app/(dashboard)/(_utils)/store/datastore';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useWalletClient } from 'wagmi';
export default function SummaryCard() {
  const [rawTxData, setRawTxData] = useState('');
  const [customerId, setCustomerId] = useState<string>(nanoid());
  const { data: walletClient } = useWalletClient();
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const totalAmount = items.reduce((acc, item) => acc + parseFloat(item.amount), 0);
  useEffect(() => {
    setRawTxData('');
    setCustomerId(nanoid());
  }, [totalAmount]);
  // const signDonations = async () => {
  //   if (!walletClient) {
  //     throw new Error('Wallet client not found');
  //   }
  //   const walletAddress = walletClient.account.address;
  //   const shortenCartItems = items.map((item) => ({
  //     amount: item.amount,
  //     anchorAddress: item.anchorAddress,
  //     roundId: item.roundId,
  //   }));

  //   setRawTxData(JSON.stringify(shortenCartItems));

  //   const projectsByChain = {
  //     [8453]: items,
  //   };

  //   const mcqAddress = '0x7C24f3494CC958CF268a92b45D7e54310d161794';
  //   const usdcToken = getTokenByChainIdAndAddress(8453, USDC);
  //   const deadline = Math.floor(Date.now() / 1000) + 100_000;
  //   const totalDonationInUSDCOnChain = totalAmount * 1_000_000;

  //   const chainId = 8453;
  //   const donations = projectsByChain[chainId];
  //   const nonce = await readContract({
  //     abi: [
  //       {
  //         constant: true,
  //         inputs: [
  //           {
  //             name: 'owner',
  //             type: 'address',
  //           },
  //         ],
  //         name: 'nonces',
  //         outputs: [
  //           {
  //             name: '',
  //             type: 'uint256',
  //           },
  //         ],
  //         payable: false,
  //         stateMutability: 'view',
  //         type: 'function',
  //       },
  //     ] as const,
  //     address: USDC,
  //     functionName: 'nonces',
  //     args: [walletAddress],
  //   });
  //   const hash = hashTypedData(
  //     usdcSignType({
  //       deadline: BigInt(deadline),
  //       nonce: nonce,
  //       owner: walletAddress,
  //       spender: mcqAddress,
  //       value: BigInt(totalDonationInUSDCOnChain),
  //     }) as any,
  //   );
  //   const signature = await walletClient.signTypedData(
  //     usdcSignType({
  //       deadline: BigInt(deadline),
  //       nonce: nonce,
  //       owner: walletAddress,
  //       spender: mcqAddress,
  //       value: BigInt(totalDonationInUSDCOnChain),
  //     }) as any,
  //   );
  //   const rsv = hexToSignature(signature);

  //   const groupedDonationsByRoundId = Object.groupBy(
  //     donations.map((d) => ({
  //       amount: d.amount,
  //       anchorAddress: d.anchorAddress,
  //       roundId: d.roundId,
  //     })),
  //     ({ roundId }) => roundId,
  //   );
  //   const groupedEncodedVotes: Record<string, Hex[]> = {};
  //   if (!groupedDonationsByRoundId) {
  //     throw new Error('groupedDonationsByRoundId is null');
  //   }
  //   for (const roundId in groupedDonationsByRoundId) {
  //     if (!groupedDonationsByRoundId[roundId]) {
  //       throw new Error('groupedDonationsByRoundId[roundId] is null');
  //     }
  //     groupedEncodedVotes[roundId] = encodedQFAllocation(
  //       usdcToken,
  //       // @ts-ignore: Object is possibly 'null'.
  //       groupedDonationsByRoundId![roundId].map((d) => ({
  //         anchorAddress: d.anchorAddress ?? '',
  //         amount: d.amount,
  //       })),
  //     );
  //   }
  //   // const groupedAmounts: Record<string, bigint> = {};
  //   // for (const roundId in groupedDonationsByRoundId) {
  //   //   if (!groupedDonationsByRoundId[roundId]) {
  //   //     continue;
  //   //   }
  //   //   groupedAmounts[roundId] = groupedDonationsByRoundId[roundId].reduce(
  //   //     (acc, donation) => acc + parseUnits(donation.amount, usdcToken.decimals),
  //   //     BigInt(0),
  //   //   );
  //   // }
  //     const amountArray: bigint[] = [];
  //     for (const roundId in groupedDonationsByRoundId) {
  //       if (!groupedDonationsByRoundId[roundId]) {
  //         continue;
  //       }
  //       // @ts-ignore: Object is possibly 'null'.
  //       groupedDonationsByRoundId[roundId].map((donation) => {
  //         amountArray.push(parseUnits(donation.amount, usdcToken.decimals));
  //       });
  //     }
  //     const poolIds = Object.keys(groupedEncodedVotes).flatMap((key) => {
  //       const count = groupedEncodedVotes[key].length;
  //       return new Array(count).fill(key);
  //     });
  //     const data = Object.values(groupedEncodedVotes).flat();

  //     const newRawTxData = encodeFunctionData({
  //       abi: MULTI_ROUND_CHECKOUT,
  //       functionName: 'allocateERC20Permit',
  //       args: [
  //         data,
  //         poolIds,
  //         Object.values(amountArray),
  //         Object.values(amountArray).reduce((acc, b) => acc + b),
  //         usdcToken.address as Hex,
  //         BigInt(deadline),
  //         parseInt(rsv.v.toString()),
  //         rsv.r as Hex,
  //         rsv.s as Hex,
  //       ],
  //     });
  //   };
  // };
  const sumbit = async () => {
    try {
      const shortenCartItems = items.map((item) => ({
        amount: item.amount,
        anchorAddress: item.anchorAddress,
        roundId: item.roundId,
      }));
      console.log({ shortenCartItems });

      const checkoutUrl = await fetch(
        'https://fxk2d1d3nf.execute-api.us-west-1.amazonaws.com/checkout/paypal',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metadata: JSON.stringify(shortenCartItems),
            customId: customerId,
            amount: totalAmount,
          }),
        },
      )
        .then((res) => res.json())
        .then((data) => data);

      console.log({ checkoutUrl });

      return checkoutUrl.id as string;
    } catch (e: unknown) {
      toast.error((e as any)?.message);
    }
  };

  return (
    <Card className="lg:w-[40%] lg:h-[60%] w-full p-4 space-y-2">
      <Text size="lg" fw="bold">
        Summary
      </Text>
      <Divider />
      <div className="flex items-center justify-between">
        <div>
          <Text>Your total contribution to </Text>
          <Text c="blue">Gitcoin</Text>
        </div>
        <Text fw="bold" size="lg">
          ${totalAmount.toFixed(2)}
        </Text>
      </div>
      <Divider />

      <PayPalScriptProvider
        options={{
          clientId:
            'ARWRaruLPRFS3ekuyixocUzPBxKUEacRHjzVR5HP-1lLJS-Fj0BJkHZ_CmA-OlQsicXGenwgOqMnYAqs',
        }}
      >
        <PayPalButtons
          style={{ layout: 'vertical' }}
          createOrder={async () => {
            const id = await sumbit();
            if (!id) {
              throw new Error('Checkout ID not found');
            }
            return id;
          }}
          onApprove={(data, actions) => {
            console.log({ customerId });
            console.log({ data });
            return fetch(
              'https://fxk2d1d3nf.execute-api.us-west-1.amazonaws.com/checkout/paypal/capture',
              {
                method: 'POST',

                body: JSON.stringify({
                  orderId: data.orderID,
                  customId: customerId,
                }),
              },
            )
              .then((response) => response.json())
              .then((orderData) => {
                toast.success(
                  'Transaction completed by ' + orderData.payer.name.given_name,
                );
                clearCart();

                const name = orderData.payer.name.given_name;
                alert(`Transaction completed by ${name}`);
              });
          }}
        />
      </PayPalScriptProvider>
    </Card>
  );
}
