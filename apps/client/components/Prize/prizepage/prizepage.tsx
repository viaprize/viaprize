/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import useAppUser from '@/components/hooks/useAppUser';
import type { PrizeWithBlockchainData, SubmissionWithBlockchainData } from '@/lib/api';
import { calculateDeadline, usdcSignType } from '@/lib/utils';

import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';
import { USDC } from '@/lib/constants';
import { Badge, Button, Center, Group, NumberInput, Stack, Title } from '@mantine/core';
import { readContract } from '@wagmi/core';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { hashTypedData, hexToSignature } from 'viem';
import { useWalletClient } from 'wagmi';
import ChangeSubmission from './buttons/changeSubmission';
import ChangeVoting from './buttons/changeVoting';
import EndDispute from './buttons/endDispute';
import EndSubmission from './buttons/endSubmission';
import EndVoting from './buttons/endVoting';
import StartSubmission from './buttons/startSubmission';
import StartVoting from './buttons/startVoting';
import PrizePageTabs from './prizepagetabs';
import RefundCard from './refundCard';
import Submissions from './submissions';

function FundUsdcCard({
  contractAddress,
  prizeId,
  title,
  imageUrl,
  successUrl,
  cancelUrl,
}: {
  contractAddress: string;
  prizeId: string;
  title: string;
  imageUrl: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const [sendLoading, setSendLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [value, setValue] = useState('');
  const getUsdcSignatureData = async () => {
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

      toast.success(<TransactionToast hash={trxHash} title="Transaction Successfull" />, {
        duration: 6000,
      });
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
        'https://49yjt1y4yg.execute-api.us-west-1.amazonaws.com/checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            checkoutMetadata: {
              contractAddress,
              backendId: prizeId,
              deadline: signedData.deadline,
              amount: signedData.value,
              ethSignedMessage: hash,
              v: v,
              r: r,
              s: s,
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
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- it will log message
      toast.error((e as any)?.message);
    } finally {
      setSendLoading(false);
    }
  };
  return (
    <Stack my="md">
      <NumberInput
        placeholder="Enter Value  in $ To Donate"
        mt="md"
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
          await donateUsingUsdc();
        }}
      >
        Donate
      </Button>

      <Button
        disabled={!value}
        loading={sendLoading}
        onClick={async () => {
          await donateUsingUsdc();
        }}
      >
        Donate With Card
      </Button>
    </Stack>
  );
}

// const { isLoading: sendLoading, sendTransaction } = useSendTransaction({
//   ...config,
//   async onSuccess(data) {
//     toast.success(`
export default function PrizePageComponent({
  prize,
  submissions,
}: {
  prize: PrizeWithBlockchainData;
  submissions: SubmissionWithBlockchainData[];
}) {
  const { appUser } = useAppUser();
  const deadlineString = calculateDeadline(
    new Date(),
    new Date(prize.submission_time_blockchain * 1000),
  );

  return (
    <div className="max-w-screen-lg px-6 py-6 shadow-md rounded-md min-h-screen my-6 relative">
      <Group justify="space-between" my="lg">
        <Title order={2}>{prize.title}</Title>
        {deadlineString === 'Time is up!' && prize.distributed === true ? (
          <Badge size="lg" color="green">
            Won
          </Badge>
        ) : // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        deadlineString === 'Time is up!' && prize.distributed === false ? (
          <Badge size="lg" color="yellow">
            Refunded
          </Badge>
        ) : null}
      </Group>
      <Image
        className="aspect-video object-cover sm:max-h-[350px] max-h-[200px] md:max-h-fit max-w-full  rounded-md"
        src={
          prize.images[0] ||
          'https://placehold.jp/24/3d4070/ffffff/1280x720.png?text=No%20Image'
        }
        width={1280}
        height={768}
        alt="prize info tumbnail"
        // imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
      <Center my="xl">
        <PrizePageTabs
          avatar={prize.user.avatar}
          email={prize.user.email}
          name={prize.user.name}
          description={prize.description}
          contractAddress={prize.contract_address}
          totalFunds={prize.balance}
          submissionDeadline={
            prize.submission_time_blockchain !== 0
              ? new Date(prize.submission_time_blockchain * 1000)
              : undefined
          }
          votingDeadline={
            prize.voting_time_blockchain !== 0
              ? new Date(prize.voting_time_blockchain * 1000)
              : undefined
          }
          username=""
        />
      </Center>
      <FundUsdcCard
        contractAddress={prize.contract_address}
        prizeId={prize.id}
        title={prize.title}
        cancelUrl={'https://example.com'}
        imageUrl={prize.images[0] || ''}
        successUrl={window.location.href}
      />
      {appUser
        ? (appUser.username === prize.user.username || appUser.isAdmin) &&
          prize.submission_time_blockchain === 0 && (
            <StartSubmission
              contractAddress={prize.contract_address}
              submissionTime={prize.submissionTime}
            />
          )
        : null}
      {appUser
        ? (appUser.username === prize.user.username || appUser.isAdmin) &&
          prize.submission_time_blockchain === 0 &&
          prize.voting_time_blockchain === 0 && (
            <StartVoting
              contractAddress={prize.contract_address}
              votingTime={prize.votingTime}
            />
          )
        : null}
      {appUser?.isAdmin &&
      !(deadlineString === 'Time is up!') &&
      prize.submission_time_blockchain > 0 ? (
        <EndSubmission contractAddress={prize.contract_address} />
      ) : null}

      {appUser?.isAdmin && prize.submission_time_blockchain ? (
        <ChangeSubmission
          contractAddress={prize.contract_address}
          submissionTime={prize.submission_time_blockchain}
        />
      ) : null}
      {appUser?.isAdmin && prize.voting_time_blockchain > 0 ? (
        <EndVoting contractAddress={prize.contract_address} />
      ) : null}
      {appUser?.isAdmin && prize.voting_time_blockchain > 0 ? (
        <ChangeVoting
          contractAddress={prize.contract_address}
          votingTime={prize.voting_time_blockchain}
        />
      ) : null}

      <Submissions
        allowVoting={prize.voting_time_blockchain > 0}
        allowSubmission={prize.submission_time_blockchain > 0}
        submissions={submissions}
        contractAddress={prize.contract_address}
      />

      <EndDispute contractAddress={prize.contract_address} />

      <RefundCard
        allowVoting={prize.voting_time_blockchain > 0}
        contractAddress={prize.contract_address}
        showVote
        votes={0}
      />
      {/* <CommentSection /> */}
    </div>
  );
}
