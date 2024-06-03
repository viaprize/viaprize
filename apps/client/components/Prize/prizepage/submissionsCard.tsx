/* eslint-disable no-implicit-coercion */
import { useFunderBalance } from '@/components/hooks/useFunderBalance';
import { prepareWritePrize, writePrize } from '@/lib/smartContract';
import { chain } from '@/lib/wagmi';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { IconArrowAutofitUp, IconRefresh } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { extractPlainTextFromEditor } from './utils';

interface SubmissionsCardProps {
  fullname: string;
  wallet: string;
  time: string;
  votes: number;
  onUpVote?: () => void;
  submissionId: string;
  contractAddress: string;
  hash: string;
  description: string;
  allowVoting: boolean;
  showVote: boolean;
  judges?: string[];
  won?: string;
}
export default function SubmissionsCard({
  fullname,
  votes,
  time,
  contractAddress,
  hash,
  description,
  allowVoting,
  submissionId,
  showVote = true,
  judges,
  won,
}: SubmissionsCardProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { address } = useAccount();
  const [sendLoading, setSendLoading] = useState(false);
  const [value, setValue] = useState('0');
  const [debounced] = useDebouncedValue(value, 500);

  const {
    data: funderBalance,
    refetch,
    loading,
  } = useFunderBalance({
    hasJudges: !!judges && judges.length > 0,
    address: address ?? '0x',
    contractAddress,
  });

  return (
    <Card className="flex flex-col justify-center gap-3 my-2">
      <Modal opened={opened} onClose={close} title="Voting For this submission">
        <Stack>
          <NumberInput
            label={
              loading
                ? 'Loading.....'
                : `Total Votes you can allocate(Max: ${formatEther(
                    BigInt(parseInt(funderBalance?.toString() ?? '0')),
                  )} ${chain.nativeCurrency.symbol} )`
            }
            placeholder="Enter Value of Votes"
            mt="md"
            rightSection={
              <ActionIcon>
                <IconRefresh onClick={() => refetch()} />
              </ActionIcon>
            }
            max={parseInt(formatEther(BigInt(funderBalance?.toString() ?? '10')))}
            allowDecimal
            allowNegative={false}
            defaultValue={0}
            value={value}
            onChange={(v) => {
              console.log('hiiiiiiiiiii');

              setValue(v.toString());
            }}
          />
          {showVote ? (
            <Button
              onClick={async () => {
                try {
                  await refetch();

                  if (
                    parseInt(debounced.toString()) >
                    parseInt(formatEther(BigInt(funderBalance?.toString() ?? '10')))
                  ) {
                    toast.error('You cannot vote more than your balance');
                    return;
                  }
                  setSendLoading(true);

                  const { request } = await prepareWritePrize({
                    address: contractAddress as `0x${string}`,
                    functionName: 'vote',
                    args: [hash as `0x${string}`, parseEther(debounced)],
                  });
                  const { hash: transactionHash } = await writePrize(request);
                  console.log({ transactionHash }, 'transactionHash');
                  toast.success(
                    `Transaction Hash ${transactionHash.slice(0, 2)}...${transactionHash.slice(-2)}`,
                  );
                  setSendLoading(false);
                  close();
                  window.location.reload();
                } catch (e) {
                  console.log(e, 'error');
                  toast.error('Error while voting');
                  window.location.reload();
                } finally {
                  setSendLoading(false);
                }
              }}
              disabled={!value}
              loading={sendLoading}
            >
              Vote!
            </Button>
          ) : null}
        </Stack>
      </Modal>
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex items-center justify-between w-full">
          <Group>
            <Avatar color="blue" radius="md" alt="creator" className="rounded-sm" />
            <div>
              <Text variant="p" fw="bold" my="0px" className="leading-[15px]">
                {fullname}
              </Text>
            </div>
          </Group>
          {won ? <Badge bg="green">{won}</Badge> : null}
        </div>
        <div>
          <Text c="dimmed" fz="sm">
            {time}
          </Text>
          <div className="flex gap-1 sm:justify-end items-center ">
            <Button color="black" mr="5px" onClick={open} disabled={!allowVoting}>
              {allowVoting && showVote ? 'Vote' : ''}
            </Button>
            {allowVoting && showVote ? (
              <Badge variant="filled" w="auto" size="lg" color="blue">
                {formatEther(BigInt(votes.toString()))} {chain.nativeCurrency.symbol}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
      <Text lineClamp={4}>
        {extractPlainTextFromEditor(description).slice(0, 350)}....
      </Text>
      <Button
        rightSection={<IconArrowAutofitUp size="1rem" />}
        onClick={() => {
          // toast.promise(router.push(`/submission/${submissionId}`), {
          //   loading: 'Loading Submission',
          //   success: 'Success',
          //   error: 'Error',
          // });
          window.open(`/submission/${submissionId}`, '_blank');
        }}
      >
        View Submission
      </Button>
    </Card>
  );
}
