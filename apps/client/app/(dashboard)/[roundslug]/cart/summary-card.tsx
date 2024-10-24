'use client';
import { TransactionToast } from '@/components/custom/transaction-toast';
import {
  matchingEstimatesToText,
  useMatchingEstimates,
} from '@/components/hooks/useMatchingEstimate';
import { MULTI_ROUND_CHECKOUT, gitcoinRounds } from '@/lib/constants';
import { collectionSchemaV1, encodedQFAllocation, usdcSignType } from '@/lib/utils';
import {
  getTokenByChainIdAndAddress,
  getTokensByChainId,
} from '@gitcoin/gitcoin-chain-data';
import { Button, Card, Divider, Select, Text } from '@mantine/core';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useCartStore } from 'app/(dashboard)/(_utils)/store/datastore';
import { groupBy, random, uniqBy } from 'lodash';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Hex, encodeFunctionData, parseSignature } from 'viem';
import { parseUnits } from 'viem/utils';
import {
  useAccount,
  useChainId,
  useReadContract,
  useSendTransaction,
  useSignTypedData,
  useSwitchChain,
  useWriteContract,
} from 'wagmi';
import { pinata } from '../../../../config/pinata';

export default function SummaryCard({ roundId ,minDonationPerProject}: { roundId: string , minDonationPerProject:number}) {
  const [customerId, setCustomerId] = useState<string>(nanoid());

  const round = gitcoinRounds.find((round) => round.roundId === roundId);

  const chainId = useChainId();
  if (!round) {
    throw new Error('Round not found');
  }
  const tokens = getTokensByChainId(round?.chainId);
  const [finalToken, setFinalToken] = useState<string | null>(tokens[0].code);
  console.log(JSON.stringify(tokens), 'tokens');
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
      .every((item) => parseFloat(item.amount) >= minDonationPerProject),
  );
  const items = useCartStore((state) =>
    state.items.filter((item) => item.roundId == roundId),
  );
  console.log('items......', items);
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
  const { address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { signTypedDataAsync } = useSignTypedData();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const { data: nonce } = useReadContract({
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
    address: round.token,
    functionName: 'nonces',

    args: [address ?? '0xECDA97e283bB41368Cf81e62977AA8a9b2C44c02'],
  });
  const createCollectionLink = async () => {
    const finalItems = useCartStore
      .getState()
      .items.filter((item) => item.roundId === roundId)
      .map((item) => ({
        amount: item.amount,
        anchorAddress: item.anchorAddress,
        roundId: item.roundId,
        chainId: item.chainId,
        id: item.id,
      }));

    const applications = finalItems.map((item) => ({
      chainId: Number.parseInt(item.chainId),
      roundId: item.roundId,
      id: item.id,
    }));

    const collection = collectionSchemaV1.parse({
      name: `${round.title} Collection form viaprize ${random(1000)}`,
      applications: applications,
      version: '1.0.0',
    });
    // const pinataClient = new PinataClient();
    // const a = await pinataClient.pinJSON(collection, {
    //   app: 'explorer',
    //   type: 'collection',
    //   version: '1.0.0',
    // });
    // console.log(a, 'a');
    const upload = await await pinata.upload.json(collection).addMetadata({
      keyValues: {
        app: 'explorer',
        type: 'collection',
        version: '1.0.0',
      },
    });
    console.log(upload, 'upload');

    const url = `https://explorer.gitcoin.co/#/collections/${upload.IpfsHash}`;

    window.open(url);
  };
  const payWithCrypto = async () => {
    if (!address) {
      toast.error('Please connect your wallet to pay with crypto');
      return;
    }
    if (chainId !== round.chainId) {
      toast.info('Please switch to the correct network to pay with crypto');
      await switchChainAsync({
        chainId: round.chainId,
      });
      return;
    }
    if (!finalToken) {
      toast.error('Please select a token to pay with');
      return;
    }

    const finalTokenObject = tokens.find((t) => t.code === finalToken);
    if (!finalTokenObject) {
      toast.error('Token not found');
      return;
    }
    if (finalTokenObject.address.toLowerCase() !== round.token.toLowerCase()) {
      createCollectionLink();
      return;
    }
    const finalItems = useCartStore
      .getState()
      .items.filter((item) => item.roundId === roundId)
      .map((item) => ({
        amount: item.amount,
        anchorAddress: item.anchorAddress,
        roundId: item.roundId,
        chainId: item.chainId,
      }));
    const finalTotalAmount = finalItems.reduce(
      (acc, item) => acc + Number.parseFloat(item.amount),
      0,
    );
    const finalAmountInCrypto = parseUnits(
      finalTotalAmount.toString(),
      finalTokenObject.decimals,
    );
    const groupedDonationsByRoundId = groupBy(
      finalItems.map((d) => ({
        amount: d.amount,
        anchorAddress: d.anchorAddress,
        roundId: d.roundId,
      })),
      'roundId',
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
        finalTokenObject,
        // @ts-ignore: Object is possibly 'null'.
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        groupedDonationsByRoundId![roundId].map((d) => ({
          anchorAddress: d.anchorAddress ?? '',
          amount: d.amount,
        })),
      );
    }
    const amountArray: bigint[] = [];
    for (const roundId in groupedDonationsByRoundId) {
      if (!groupedDonationsByRoundId[roundId]) {
        continue;
      }
      // @ts-ignore: Object is possibly 'null'.
      groupedDonationsByRoundId[roundId].map((donation) => {
        amountArray.push(parseUnits(donation.amount, finalTokenObject.decimals));
      });
    }
    const poolIds = Object.keys(groupedEncodedVotes).flatMap((key) => {
      const count = groupedEncodedVotes[key].length;
      return new Array(count).fill(key);
    });
    const data = Object.values(groupedEncodedVotes).flat();

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 60);
    console.log(round.chainId, 'chaindi');
    const usdcSign = usdcSignType({
      chainId: round.chainId,
      deadline: deadline,
      name: round.tokenName,
      nonce: nonce ?? BigInt(0),
      owner: address,
      spender: round.gitCoinCheckoutAddress,
      usdc: round.token,
      value: finalAmountInCrypto,
      version: round.tokenVersion,
    });
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const signature = await signTypedDataAsync(usdcSign as any);

    const rsv = parseSignature(signature);

    const txData = encodeFunctionData({
      abi: MULTI_ROUND_CHECKOUT,

      functionName: 'allocateERC20Permit',
      args: [
        data,
        poolIds,
        Object.values(amountArray),
        Object.values(amountArray).reduce((acc, b) => acc + b),
        finalTokenObject.address,
        BigInt(deadline),
        Number.parseInt(rsv.v?.toString() ?? '1'),
        rsv.r as Hex,
        rsv.s as Hex,
      ],
    });
    const tx = await sendTransactionAsync({
      to: round.gitCoinCheckoutAddress,
      data: txData,
      value: BigInt(0),
      chainId: round.chainId,
    });
    if (tx) {
      toast.success(
        <div className="w-96">
          <TransactionToast
            title="Transaction Successful"
            hash={tx}
            scanner={`${round.explorer}tx/`}
          />
          <div className="items-center p-3 text-lg font-bold ">
            <p>
              It may take 15-20 seconds for your donation to show in the project totals.
            </p>
          </div>
        </div>,
        {
          duration: 20000,
        },
      );
      clearCart();
    }
  };
  const sumbit = async () => {
    try {
      const finalItems = useCartStore
        .getState()
        .items.filter((item) => item.roundId == roundId)
        .map((item) => ({
          amount: item.amount,
          anchorAddress: item.anchorAddress,
          roundId: item.roundId,
          chainId: item.chainId,
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
      {/* <Divider /> */}
      {!meetsMinimumDonation && (
        <Text c="red">Each project must have a minimum donation amount of {minDonationPerProject} USD.</Text>
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
                      scanner={`${round.explorer}tx/`}
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
      <Text c="red" fw={400}>
        For your donation to receive matching funds please make sure a bank account is
        linked to your PayPal
      </Text>
      <Divider my="md" />
      {address ? (
        <div>
          {' '}
          <Select
            label="Select token"
            placeholder="Select token"
            data={uniqBy(tokens, 'code').map((t) => t.code)}
            defaultValue={tokens[0].code}
            value={finalToken}
            onChange={(value) => setFinalToken(value)}
          />
          <Button onClick={payWithCrypto}>Pay with crypto</Button>
        </div>
      ) : (
        <Text c="yellow">Please connect your wallet if you want to pay with crypto</Text>
      )}
    </Card>
  );
}
