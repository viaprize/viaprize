'use client';
import { TransactionToast } from '@/components/custom/transaction-toast';
import { Button, Card, Divider, Text } from '@mantine/core';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useCartStore } from 'app/(dashboard)/(_utils)/store/datastore';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
export default function SummaryCard() {
  const [customerId, setCustomerId] = useState<string>(nanoid());
  const totalAmount = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + parseFloat(item.amount), 0),
  );
  const { clearCart } = useCartStore();

  const meetsMinimumDonation = totalAmount >= 2;

  useEffect(() => {
    setCustomerId(nanoid());
  }, [totalAmount]);

  const sumbit = async () => {
    try {
      const finalItems = useCartStore.getState().items.map((item) => ({
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
      {!meetsMinimumDonation && (
        <Text color="red">Minimum donation amount is $2 USD.</Text>
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
                  // <TransactionToast
                  //   title="Transaction completed by"
                  //   hash={orderData.payer.name.given_name}
                  // />,
                  <div className="">
                    <TransactionToast
                      title="Transaction Successful"
                      hash={orderData.hash}
                      scanner="https://arbiscan.io/tx/"
                    />
                    <div className="bg-slate-100 items-center ">
                      <div className="">
                        Donor name:{' '}
                        <span className="text-blue-400">
                          {orderData.payer.name.given_name}
                        </span>
                      </div>
                      After the transaction is approved,it may take 15-20 seconds for your
                      donation record to update in the projects.The donation amount will
                      then be displayed on the explore and info page of the projects.
                    </div>
                  </div>,
                  {
                    duration: 6000,
                  },
                );
                clearCart();
              });
          }}
        />
      </PayPalScriptProvider>

      <Button component="a" href="/qf/opencivics/explore">
        Goto explore page
      </Button>
    </Card>
  );
}
