'use client';
import { TransactionToast } from '@/components/custom/transaction-toast';
import {
  matchingEstimatesToText,
  useMatchingEstimates,
} from '@/components/hooks/useMatchingEstimate';
import { gitcoinRounds } from '@/lib/constants';
import { getTokenByChainIdAndAddress } from '@gitcoin/gitcoin-chain-data';
import { Card, Divider, Text } from '@mantine/core';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useCartStore } from 'app/(dashboard)/(_utils)/store/datastore';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { parseUnits } from 'viem/utils';

export default function SummaryCard({ roundId }: { roundId: string }) {
  const [customerId, setCustomerId] = useState<string>(nanoid());
  const round = gitcoinRounds.find((round) => round.roundId === roundId);
  if (!round) {
    throw new Error('Round not found');
  }
  const totalAmount = useCartStore((state) =>
    state.items
      .filter((item) => item.roundId == roundId)
      .reduce(
        (acc, item) =>
          acc + (isNaN(parseFloat(item.amount)) ? 0 : parseFloat(item.amount)),
        0,
      ),
  );
  const { clearCart } = useCartStore();

  const meetsMinimumDonation = useCartStore((state) =>
    state.items
      .filter((item) => item.roundId == roundId)
      .every((item) => parseFloat(item.amount) >= 0.5),
  );
  const items = useCartStore((state) =>
    state.items.filter((item) => item.roundId == roundId),
  );
  const tokenTT = getTokenByChainIdAndAddress(round.chainId, round.token);
  console.log('token......', tokenTT);
  const {
    data: matchingEstimates,
    error: matchingEstimateError,
    isLoading: matchingEstimateLoading,
    refetch: refetchMatchingEstimates,
  } = useMatchingEstimates([
    {
      roundId: round.roundId,
      chainId: round.chainId,
      potentialVotes: items.map((item) => ({
        roundId: item.roundId,
        projectId: item.projectId,
        amount:
          !!item.amount && !Number.isNaN(Number.parseInt(item.amount))
            ? parseUnits(item.amount ?? '0', tokenTT.decimals ?? 18)
            : BigInt(0),
        grantAddress: item.metadata.application.recipient,
        voter: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        token: tokenTT.address,
        applicationId: item.id,
      })),
    },
  ]);

  const estimate = matchingEstimatesToText(matchingEstimates);

  useEffect(() => {
    setCustomerId(nanoid());
    refetchMatchingEstimates();
  }, [totalAmount]);

  const sumbit = async () => {
    try {
      const finalItems = useCartStore
        .getState()
        .items.filter((item) => item.roundId == roundId)
        .map((item) => ({
          amount: item.amount,
          anchorAddress: item.anchorAddress,
          roundId: item.roundId,
        }));
      const finalTotalAmount = finalItems.reduce(
        (acc, item) => acc + parseFloat(item.amount),
        0,
      );
      console.log({ finalItems });
      console.log({ customerId });
      const checkoutUrl = await fetch(
        'https://fxk2d1d3nf.execute-api.us-west-1.amazonaws.com/checkout/paypal',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metadata: JSON.stringify(finalItems),
            customId: customerId,
            amount: finalTotalAmount,
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
          <Text>Your total contribution is</Text>
        </div>
        <Text fw="bold" size="lg">
          ${totalAmount.toFixed(2)}
        </Text>
      </div>
      {!Number.isNaN(totalAmount) && estimate !== 0 && estimate ? (
        <div className="flex items-center justify-between">
          <div>
            <Text>Total estimated matching is</Text>
          </div>
          <Text fw="bold" size="lg">
            ${estimate?.toFixed(2)}
          </Text>
        </div>
      ) : null}
      {matchingEstimateLoading && (
        <div className="flex items-center justify-between">
          <Text>Loading Estimated Matching</Text>
        </div>
      )}
      <Text fs="italic" fw={500}>
        PayPal fees and a 5% platform fee will be deducted.{' '}
        <span>
          To know more about the PayPal fees
          <Link
            href="https://www.paypal.com/us/webapps/mpp/merchant-fees"
            className="text-blue-400 underline mx-2"
            target="_blank"
            rel="noreferrer"
          >
            click here
          </Link>
        </span>
      </Text>
      <Divider />
      {!meetsMinimumDonation && (
        <Text c="red">Each project must have a minimum donation amount of 2 USD.</Text>
      )}

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
          onApprove={(data, actions) => {
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
                const name = orderData.payer.name.given_name;
                toast.success(
                  <div className="w-96">
                    <TransactionToast
                      title="Transaction Successful"
                      hash={orderData.hash}
                      scanner="https://arbiscan.io/tx/"
                    />
                    <div className="items-center p-3 text-lg font-bold ">
                      <div>
                        Donor name: <span className="text-blue-400">{name}</span>
                      </div>
                      <p>
                        It may take 15-20 seconds for your donation to show in the project
                        totals.
                      </p>
                    </div>
                  </div>,
                  {
                    duration: 20000,
                  },
                );
                clearCart();
              });
          }}
          disabled={!meetsMinimumDonation || items.length === 0}
        />
      </PayPalScriptProvider>
    </Card>
  );
}
