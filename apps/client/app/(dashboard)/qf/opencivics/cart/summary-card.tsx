'use client';
import { TransactionToast } from '@/components/custom/transaction-toast';
import { Card, Divider, Text, Button } from '@mantine/core';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { IconInfoCircle } from '@tabler/icons-react';
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

  // const triggerTestToast = () => {
  //   toast.success(
  //     <div className="">
  //       <TransactionToast title="Transaction Successful" hash="0x1234" />
  //       <div className="bg-slate-100 items-center ">
  //         <div className="">
  //           Donor name: <span className="text-blue-400">John Doe</span>
  //         </div>
  //          After the transaction is approved, it may take 15-20 seconds
  //         for your donation record to update in the projects.The donation amount will
  //         then be displayed on the explore and info page of the projects.
  //       </div>
  //     </div>,
  //     {
  //             duration: 6000,
  //           },
  //   );
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

      {/* <Button onClick={triggerTestToast}>Test Toast</Button> */}

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
                  // <TransactionToast
                  //   title="Transaction completed by"
                  //   hash={orderData.payer.name.given_name}
                  // />,
                  <div className="">
                    <TransactionToast
                      title="Transaction Successful"
                      hash={orderData.hash}
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

                const name = orderData.payer.name.given_name;
                alert(`Transaction completed by ${name}`);
              });
          }}
        />
      </PayPalScriptProvider>
    </Card>
  );
}
