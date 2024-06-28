/* eslint-disable no-implicit-coercion */
import { TransactionToast } from '@/components/custom/transaction-toast';
import type { Prize } from '@/lib/api';
import { backendApi } from '@/lib/backend';
import { VOTE_ABI } from '@/lib/constants';
import { formatUsdc, parseUsdc, voteMessageHash } from '@/lib/utils';
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
import { readContract } from '@wagmi/core';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { hashMessage, hexToSignature } from 'viem';
import { useContractRead, useWalletClient } from 'wagmi';
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
  prize?: Prize;
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
  prize,
}: SubmissionsCardProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: walletClient } = useWalletClient();
  const [loading, setSendLoading] = useState(false);
  const [value, setValue] = useState('0');
  const [debounced] = useDebouncedValue(value, 500);

  const onProfile = fullname.length === 0;

  const { data: funderAmount, refetch } = useContractRead({
    abi: VOTE_ABI,
    address: contractAddress as `0x${string}`,
    functionName: 'funderAmount',
    args: [walletClient?.account.address as `0x${string}`],
  });

  console.log(fullname.length, onProfile, 'fullname.length');

  const vote = async () => {
    const address = walletClient?.account.address;
    if (!address) {
      toast.error('Connect Wallet');
      return;
    }
    if (!funderAmount) {
      toast.error('Loading funder amount');
      return;
    }

    const finalVote = formatUsdc(parseFloat(debounced.toString()));
    try {
      const isFunder = await readContract({
        abi: VOTE_ABI,
        address: contractAddress as `0x${string}`,
        functionName: 'isFunder',
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        args: [address as `0x${string}`],
      });

      if (!isFunder) {
        toast.error('You are not a funder');
        return;
      }

      if (finalVote <= 0) {
        toast.error('You cannot vote 0 or less');
        return;
      }
      console.log({ finalVote, funderAmount });
      if (parseInt(finalVote.toString()) > parseInt(funderAmount.toString())) {
        toast.error(
          `You cannot vote more than your balance which is ${parseUsdc(funderAmount)}`,
        );
        return;
      }

      const nonce = await readContract({
        abi: VOTE_ABI,
        address: contractAddress as `0x${string}`,
        functionName: 'nonce',
      });

      const voteHash = voteMessageHash(
        hash,
        parseInt(finalVote.toString()),
        parseInt(nonce.toString()) + 1,
        contractAddress,
      );
      const signature = await walletClient.signMessage({
        message: {
          raw: voteHash as `0x${string}`,
        },
      });

      // eslint-disable-next-line @typescript-eslint/await-thenable
      const finalHash = await hashMessage({
        raw: voteHash as `0x${string}`,
      });
      console.log({ finalHash });

      console.log({ signature });

      const { r, s, v } = hexToSignature(signature);
      console.log({ finalVote });
      const tx = await (
        await backendApi()
      ).wallet
        .prizeVoteCreate(contractAddress, {
          submissionHash: hash,
          v: parseInt(v.toString()),
          s,
          r,
          amount: parseInt(finalVote.toString()),
        })
        .then((res) => res.data.hash);

      setSendLoading(false);
      toast.success(<TransactionToast hash={tx} title="Voted Successfully" />);
      await refetch();
      close();
    } catch (e) {
      console.log(e, 'error');
      toast.error('Error while voting');
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <Card className="flex flex-col justify-center gap-3 my-2">
      {!onProfile ? (
        <>
          <Modal opened={opened} onClose={close} title="Voting For this submission">
            <Stack>
              <NumberInput
                label={
                  loading
                    ? 'Loading.....'
                    : `Total Votes you can allocate(Max: ${parseUsdc(funderAmount ?? BigInt(0))} )`
                }
                placeholder="Enter Value of Votes"
                mt="md"
                rightSection={
                  <ActionIcon>
                    <IconRefresh onClick={() => refetch()} />
                  </ActionIcon>
                }
                max={funderAmount ? parseInt(funderAmount.toString()) : 0}
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
                <Button onClick={vote} disabled={!value || !!loading} loading={loading}>
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
                    {parseUsdc(BigInt(votes))} USD
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              <Link href={`/prize/${prize?.slug}`}>
                <Text variant="p" fw="bold" my="0px" className="leading-[15px]">
                  {prize?.title}
                </Text>
              </Link>
            </div>
            {won ? <Badge bg="green">{won}</Badge> : null}
          </div>
          <div>
            <Text c="dimmed" fz="sm">
              {time}
            </Text>
          </div>
        </div>
      )}
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
