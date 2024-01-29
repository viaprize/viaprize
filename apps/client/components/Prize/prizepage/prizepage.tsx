'use client';
import useAppUser from '@/components/hooks/useAppUser';
import type { PrizeWithBlockchainData, SubmissionWithBlockchainData } from '@/lib/api';
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
import { IconRefresh } from '@tabler/icons-react';
import { prepareSendTransaction, sendTransaction } from '@wagmi/core';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import ChangeSubmission from './buttons/changeSubmission';
import ChangeVoting from './buttons/changeVoting';
import EarlyRefund from './buttons/earlyRefund';
import EndSubmission from './buttons/endSubmission';
import EndVoting from './buttons/endVoting';
import StartSubmission from './buttons/startSubmission';
import StartVoting from './buttons/startVoting';
import PrizePageTabs from './prizepagetabs';
import Submissions from './submissions';

function FundCard({ contractAddress }: { contractAddress: string }) {
  const { address } = useAccount();
  const [value, setValue] = useState('');
  const [debounced] = useDebouncedValue(value, 500);

  const { data: balance, isLoading, refetch } = useBalance({ address });

  // const { config } = usePrepareSendTransaction({
  //   to: contractAddress,
  //   value: debounced ? parseEther(debounced) : undefined,
  // });
  const [sendLoading, setSendLoading] = useState(false);

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
        label={
          isLoading
            ? 'Loading.....'
            : `Enter Value To Donate (Max: ${balance?.formatted} ${balance?.symbol} )`
        }
        placeholder="Custom right section"
        mt="md"
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
            console.log({ v }, 'inner v');
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

          if (parseInt(debounced.toString()) > parseInt(balance?.formatted as string)) {
            toast.error('Insufficient Balance');
            return;
          }
          setSendLoading(true);

          const config = await prepareSendTransaction({
            to: contractAddress,
            value: debounced ? parseEther(debounced) : undefined,
            data: '0x',
          });

          const { hash } = await sendTransaction(config);
          toast.success(`Transaction ${hash}`, {
            duration: 6000,
          });
          setSendLoading(false);
          window.location.reload();
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
  console.log({ prize });
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
        className="aspect-video object-cover sm:max-h-[350px] max-h-[200px] md:max-h-[430px] max-w-full rounded-md"
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
          email={prize.user.email}
          name={prize.user.name}
          description={prize.description}
          contractAddress={prize.contract_address}
        />
      </Center>
      {appUser ? <FundCard contractAddress={prize.contract_address} /> : null}
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
        ? (appUser.username === prize.user.username || appUser?.isAdmin) &&
          prize.submission_time_blockchain === 0 &&
          prize.voting_time_blockchain === 0 && (
            <StartVoting
              contractAddress={prize.contract_address}
              votingTime={prize.votingTime}
            />
          )
        : null}
      {appUser?.isAdmin && prize.submission_time_blockchain > 0 && (
        <EndSubmission contractAddress={prize.contract_address} />
      )}

      {appUser?.isAdmin && prize.submission_time_blockchain ? (
        <ChangeSubmission
          contractAddress={prize.contract_address}
          submissionTime={prize.submission_time_blockchain}
        />
      ) : null}

      {appUser?.isAdmin && !prize.distributed && (
        <EarlyRefund contractAddress={prize.contract_address} />
      )}
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
    </div>
  );
}
