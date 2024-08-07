/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import useAppUser from '@/components/hooks/useAppUser';
import {
  type IndividualPrizeWithBalance,
  type SubmissionWithBlockchainData,
} from '@/lib/api';
import { usdcSignType } from '@/lib/utils';

import { TransactionToast } from '@/components/custom/transaction-toast';
import useMounted from '@/components/hooks/useMounted';
import { backendApi } from '@/lib/backend';
import { USDC } from '@/lib/constants';
import {
  Badge,
  Button,
  Center,
  Group,
  Image,
  Modal,
  NumberInput,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { readContract } from '@wagmi/core';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import revalidate from 'utils/revalidate';
import { hashTypedData, hexToSignature } from 'viem';
import { useWalletClient } from 'wagmi';
import ChangeSubmission from './buttons/changeSubmission';
import ChangeVotingTime from './buttons/changeVotingTime';
import EndDispute from './buttons/endDispute';
import EndDisputeEarly from './buttons/endDisputeEarly';
import EndSubmission from './buttons/endSubmission';
import EndVoting from './buttons/endVoting';
import StartSubmission from './buttons/startSubmission';
import StartVoting from './buttons/startVoting';
import PrizePageTabs from './prizepagetabs';
import RefundCard from './refundCard';
import Submissions from './submissions';

import { useDisclosure } from '@mantine/hooks';
import { IconXboxX } from '@tabler/icons-react';

interface DonatingWithoutLoginProps {
  opened: boolean;
  open: () => void;
  contractAddress: string;
  prizeId: string;
  title: string;
  imageUrl: string;
  successUrl: string;
  cancelUrl: string;
  slug: string;
  close: () => void;
}

const DonatingWithoutLoginModal: React.FC<DonatingWithoutLoginProps> = ({
  opened,
  open,
  contractAddress,
  prizeId,
  close,
  imageUrl,
  title,
  successUrl,
  cancelUrl,
  slug,
}) => {
  const router = useRouter();

  const [sendLoading, setSendLoading] = useState(false);

  const [value, setValue] = useState('');

  const onDonate = async () => {
    try {
      setSendLoading(true);
      const balance = (
        await (
          await fetch(
            'https://fxk2d1d3nf.execute-api.us-west-1.amazonaws.com/reserve/balance',
          )
        ).json()
      ).balance;

      if (parseFloat(value) * 1_000_000 > balance) {
        toast.error('Not enough reserves to complete this transaction');
        return;
      }
      const amount = parseFloat(value) * 1_000_000;
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
              deadline: 0,
              amount: amount,
              ethSignedMessage: '',
              v: 0,
              r: '',
              s: '',
              chainId: 8453,
              payWihtoutLogin: 1,
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

      await revalidate({ tag: slug });
      router.refresh();
      router.replace(checkoutUrl);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSendLoading(false);
    }
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Notice"
        classNames={{
          title: 'text-lg font-semibold',
        }}
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}
      >
        <div className="text-center">
          <Text className="font-bold">
            If you want to <span className="text-blue-600">vote on the winner</span>, you
            will need to log in before donating, else{' '}
            <span className="text-red-500">donate as guest.</span>
          </Text>
        </div>
        <Group className="mt-4">
          <Stack className="mx-auto">
            <Group>
              <Text fw="sm" className="text-center">
                Your donation needs to be at least $1
              </Text>
            </Group>
            <NumberInput
              placeholder="Enter Value  in $ To Donate"
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
                await onDonate();
              }}
            >
              Donate as guest
            </Button>
          </Stack>
        </Group>
      </Modal>
    </>
  );
};

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
  const { logoutUser, appUser, loginUser } = useAppUser();
  const [sendLoading, setSendLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [value, setValue] = useState('');
  const router = useRouter();

  const getUsdcSignatureData = async () => {
    // if (parseFloat(value) <= 0) {
    //   throw new Error('Donation must be at least 1$');
    // }
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
      console.log(e, 'sklfjlsdfjlkjljlksdjflksjl');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- it will log message
      toast.error((e as any)?.message);
      if ((e as any).data == null) {
        toast.error((e as any).error.message);
      }
    } finally {
      setSendLoading(false);
    }
  };

  const donateUsingFiat = async () => {
    const balance = (
      await (
        await fetch(
          'https://fxk2d1d3nf.execute-api.us-west-1.amazonaws.com/reserve/balance',
          {
            headers: {
              'x-chain-id': '8453',
            },
          },
        )
      ).json()
    ).balance;
    console.log({ balance });
    if (parseFloat(value) * 1_000_000 > balance) {
      toast.error('Not enough balance to donate');
      return;
    }
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
              payWihtoutLogin: 0,
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
    <Stack>
      <Group>
        <Text fw="sm">Your donation needs to be at least $1</Text>
        {appUser ? null : (
          <Button
            color="primary"
            onClick={() => {
              void loginUser();
            }}
          >
            Connect Wallet
          </Button>
        )}
      </Group>
      <NumberInput
        placeholder="Enter Value  in $ To Donate"
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
        Donate with Crypto
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

export default function PrizePageComponent({
  prize,
  submissions,
}: {
  prize: IndividualPrizeWithBalance;
  submissions: SubmissionWithBlockchainData[];
}) {
  const { appUser } = useAppUser();
  console.log(prize.submission_time_blockchain, 'lsljfkjds prize subision');
  const params = useParams();
  useEffect(() => {
    if (window.location.hash.includes('success')) {
      void fetch(
        'https://fxk2d1d3nf.execute-api.us-west-1.amazonaws.com/reserve/hash',
      ).then((res) => {
        res.json().then((data) => {
          toast.success(
            <TransactionToast hash={data.hash} title="Transaction Successful" />,
            {
              duration: 6000,
            },
          );
        });
      });
    }
  }, [params]);

  const [opened, { open, close }] = useDisclosure(false);

  const mounted = useMounted();

  return (
    <div className="max-w-screen-lg px-6 py-6 shadow-md rounded-md min-h-screen my-6 relative">
      <Group justify="space-between" my="lg">
        <Title order={2}>{prize.title}</Title>
        {prize.distributed === true ? (
          <Badge size="lg" color="green">
            Won
          </Badge>
        ) : prize.refunded ? (
          <Badge size="lg" color="yellow">
            Refunded
          </Badge>
        ) : null}
      </Group>
      <Image
        src={
          prize.images[0] ||
          'https://placehold.jp/24/3d4070/ffffff/1280x720.png?text=No%20Image'
        }
        radius="md"
        alt="prize info tumbnail"
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
          contributions={prize.contributors}
        />
      </Center>
      {prize.is_active_blockchain ? (
        <FundUsdcCard
          contractAddress={prize.contract_address}
          prizeId={prize.id}
          title={prize.title}
          cancelUrl={mounted ? window.location.href : ''}
          imageUrl={prize.images[0] || ''}
          successUrl={`${window.location.href}#success`}
          slug={prize.slug}
        />
      ) : null}

      {!appUser && prize.is_active_blockchain && (
        <>
          <DonatingWithoutLoginModal
            cancelUrl={mounted ? window.location.href : ''}
            imageUrl={prize.images[0] || ''}
            contractAddress={prize.contract_address}
            prizeId={prize.id}
            slug={prize.slug}
            successUrl={`${window.location.href}#success`}
            opened={opened}
            open={open}
            close={close}
            title={prize.title}
          />

          <Button
            onClick={open}
            className="bg-blue-600 hover:bg-blue-700 text-white mx-auto w-full my-4"
          >
            Donate without login
          </Button>
        </>
      )}

      {appUser
        ? appUser.isAdmin &&
          prize.submission_time_blockchain === 0 && (
            <StartSubmission
              contractAddress={prize.contract_address}
              submissionTime={prize.submissionTime}
              slug={prize.slug}
            />
          )
        : null}
      {appUser
        ? appUser.isAdmin &&
          prize.submission_time_blockchain === 0 &&
          prize.voting_time_blockchain === 0 && (
            <StartVoting
              contractAddress={prize.contract_address}
              votingTime={prize.votingTime}
              slug={prize.slug}
            />
          )
        : null}
      {appUser?.isAdmin && prize.submission_time_blockchain > 0 ? (
        <EndSubmission contractAddress={prize.contract_address} slug={prize.slug} />
      ) : null}

      {appUser?.isAdmin && prize.submission_time_blockchain ? (
        <ChangeSubmission
          contractAddress={prize.contract_address}
          submissionTime={prize.submission_time_blockchain}
          slug={prize.slug}
        />
      ) : null}
      {appUser?.isAdmin && prize.voting_time_blockchain > 0 ? (
        <EndVoting contractAddress={prize.contract_address} slug={prize.slug} />
      ) : null}
      {appUser?.isAdmin && prize.voting_time_blockchain > 0 ? (
        <ChangeVotingTime
          contractAddress={prize.contract_address}
          votingTime={prize.voting_time_blockchain}
          slug={prize.slug}
        />
      ) : null}

      <Submissions
        allowVoting={prize.voting_time_blockchain > 0}
        allowSubmission={prize.submission_time_blockchain > 0}
        submissions={submissions}
        contractAddress={prize.contract_address}
      />

      {appUser?.isAdmin && prize.dispute_period_time_blockchain > 0 ? (
        <>
          <EndDispute contractAddress={prize.contract_address} />
          <EndDisputeEarly contractAddress={prize.contract_address} />
        </>
      ) : null}

      {prize.voting_time_blockchain > 0 ? (
        <RefundCard
          allowVoting={prize.voting_time_blockchain > 0}
          contractAddress={prize.contract_address}
          showVote
        />
      ) : null}
      {/* <CommentSection /> */}
    </div>
  );
}
