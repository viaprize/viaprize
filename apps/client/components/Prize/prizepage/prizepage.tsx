/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import useAppUser from '@/components/hooks/useAppUser';
import type { PrizeWithBlockchainData, SubmissionWithBlockchainData } from '@/lib/api';
import type { ConvertUSD } from '@/lib/types';
import { chain } from '@/lib/wagmi';
import {
  ActionIcon,
  Button,
  Center,
  Group,
  NumberInput,
  Stack,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconRefresh } from '@tabler/icons-react';
import { prepareSendTransaction, sendTransaction } from '@wagmi/core';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useAccount, useBalance, useQuery } from 'wagmi';
import ChangeSubmission from './buttons/changeSubmission';
import ChangeVoting from './buttons/changeVoting';
import EarlyRefund from './buttons/earlyRefund';
import EndSubmission from './buttons/endSubmission';
import EndVoting from './buttons/endVoting';
import StartSubmission from './buttons/startSubmission';
import StartVoting from './buttons/startVoting';
import PrizePageTabs from './prizepagetabs';
import Submissions from './submissions';
import { calculateDeadline } from '@/lib/utils';

function FundCard({ contractAddress }: { contractAddress: string }) {
  const { address } = useAccount();
  const [value, setValue] = useState('');
  const [debounced] = useDebouncedValue(value, 500);
  const { loginUser } = useAppUser();

  const { data: balance, isLoading, refetch } = useBalance({ address });

  // const { config } = usePrepareSendTransaction({
  //   to: contractAddress,
  //   value: debounced ? parseEther(debounced) : undefined,
  // });

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: 'Please Login to Donate',
      centered: true,
      children: (
        <p>
          Please Login to donate to the prize, orelse you wont be able to get the refund
        </p>
      ),
      labels: { confirm: 'Login', cancel: 'Cancel' },
      onCancel: () => {
        console.log('Cancel');
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onConfirm: async () => {
        await loginUser();
      },
    });
  };

  const [sendLoading, setSendLoading] = useState(false);

  const { data: cryptoToUsd } = useQuery<ConvertUSD>(['get-crypto-to-usd'], async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  const ethOfDonateValue = useMemo(() => {
    if (!cryptoToUsd) {
      console.error('cryptoToUsd is undefined');
      return 0;
    }
    const cryptoToUsdValue = cryptoToUsd.ethereum.usd;
    const useToEth = parseFloat(value) / cryptoToUsdValue;
    return isNaN(useToEth) ? 0 : useToEth;
  }, [value]);

  // const { isLoading: sendLoading, sendTransaction } = useSendTransaction({
  //   ...config,
  //   async onSuccess(data) {
  //     toast.success(`Transaction Sent with Hash ${data?.hash}`, {
  //       duration: 6000,
  //     });
  //     await refetch();
  //   },
  // });

  return (
    <Stack my="md">
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- will replace later
        onClick={async () => {
          if (!address) {
            openDeleteModal();
          }
          await refetch();
          setSendLoading(true);
          try {
            const config = await prepareSendTransaction({
              to: contractAddress,
              value: debounced ? parseEther(ethOfDonateValue.toString()) : undefined,
              data: '0x',
            });
            const { hash } = await sendTransaction(config);
            toast.success(`Transaction  ${hash.slice(0, 8)}...${hash.slice(-8)}`, {
              duration: 6000,
            });
            window.location.reload();
          } catch (e: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- it will log message
            toast.error((e as any)?.message);
          } finally {
            setSendLoading(false);
          }
        }}
      >
        Donate
      </Button>
    </Stack>
  );
}
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
        {prize.distributed ? <Title order={3}>Prize Has Ended</Title> : null}

        {/* <Group justify="right" gap="0" wrap="nowrap">
          <Button color="black" mx="5px">
            Upvote
          </Button>
          <ActionIcon variant="filled" size="lg" color="blue">
            <Text>0</Text>
          </ActionIcon>
        </Group> */}
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
        />
      </Center>
      <FundCard contractAddress={prize.contract_address} />
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
      {appUser?.isAdmin && !(deadlineString === 'Time is up!') && prize.submission_time_blockchain > 0 ? (
        <EndSubmission contractAddress={prize.contract_address} />
      ) : null}

      {appUser?.isAdmin && prize.submission_time_blockchain ? (
        <ChangeSubmission
          contractAddress={prize.contract_address}
          submissionTime={prize.submission_time_blockchain}
        />
      ) : null}
      {appUser?.isAdmin && !prize.distributed ? (
        <EarlyRefund contractAddress={prize.contract_address} />
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
      {/* <CommentSection /> */}
    </div>
  );
}
