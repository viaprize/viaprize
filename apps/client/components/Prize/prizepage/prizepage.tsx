import {
  ActionIcon,
  Button,
  Center,
  Flex,
  Group,
  NumberInput,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import useAppUser from '@/context/hooks/useAppUser';
import { PrizeWithBlockchainData, SubmissionWithBlockchainData } from '@/lib/api';
import { useDebouncedValue } from '@mantine/hooks';
import { IconRefresh } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import {
  useAccount,
  useBalance,
  usePrepareSendTransaction,
  useSendTransaction,
} from 'wagmi';
import EndSubmission from './buttons/endSubmission';
import EndVoting from './buttons/endVoting';
import StartSubmission from './buttons/startSubmission';
import StartVoting from './buttons/startVoting';
import PrizePageTabs from './prizepagetabs';
import Submissions from './submissions';

function FundCard({ contractAddress }: { contractAddress: string }) {
  const { address } = useAccount();
  const [value, setValue] = useState('0');
  const [debounced] = useDebouncedValue(value, 500);

  console.log({ value }, 'value');
  console.log(address, 'addresssss');
  console.log(contractAddress, 'contractAddress');

  const { data: balance, isLoading, refetch } = useBalance({ address });

  const { config } = usePrepareSendTransaction({
    to: contractAddress,
    value: debounced ? parseEther(debounced) : undefined,
  });
  useEffect(() => {
    refetch().then(console.log).catch(console.error);
  }, []);
  const { isLoading: sendLoading, sendTransaction } = useSendTransaction({
    ...config,
    async onSuccess(data) {
      toast.success(`Transaction Sent with Hash ${data?.hash}`, {
        duration: 6000,
      });
      await refetch();
    },
  });

  return (
    <Stack my={'md'}>
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
            <IconRefresh onClick={() => refetch()} />
          </ActionIcon>
        }
        max={parseInt(balance?.formatted as string)}
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
        disabled={!sendTransaction}
        loading={sendLoading}
        onClick={() => {
          sendTransaction?.();
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
      <Flex justify="space-between" my="lg">
        <Title order={2}>{prize.title}</Title>
        <Group justify="right" gap="0" wrap="nowrap">
          <Button color="black" mx="5px">
            Upvote
          </Button>
          <ActionIcon variant="filled" size="lg" color="blue">
            <Text>0</Text>
          </ActionIcon>
        </Group>
      </Flex>
      <img
        className="aspect-video object-cover sm:max-h-[350px] max-h-[200px] md:max-h-[430px] max-w-full rounded-md"
        src={prize.images[0]}
        width={1280}
        height={768}
        alt="prize info tumbnail"
        // imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
      <Center my="xl">
        <PrizePageTabs contractAddress={prize.contract_address} />
      </Center>
      {appUser && <FundCard contractAddress={prize.contract_address} />}

      {appUser &&
        appUser.username === prize.user.username &&
        prize.submission_time_blockchain === 0 && (
          <StartSubmission
            contractAddress={prize.contract_address}
            submissionTime={prize.submissionTime}
          />
        )}

      {appUser &&
        appUser.username === prize.user.username &&
        prize.submission_time_blockchain > 0 &&
        prize.voting_time_blockchain === 0 && (
          <StartVoting
            contractAddress={prize.contract_address}
            votingTime={prize.votingTime}
          />
        )}
      {appUser?.isAdmin && prize.submission_time_blockchain > 0 && (
        <EndSubmission contractAddress={prize.contract_address} />
      )}
      {appUser?.isAdmin && prize.voting_time_blockchain > 0 && (
        <EndVoting contractAddress={prize.contract_address} />
      )}
      <Submissions submissions={submissions} contractAddress={prize.contract_address} />
    </div>
  );
}
