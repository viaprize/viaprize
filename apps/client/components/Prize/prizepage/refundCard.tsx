/* eslint-disable no-implicit-coercion */
import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';
import { VOTE_ABI } from '@/lib/constants';
import { formatUsdc, parseUsdc, refundHash, voteMessageHash } from '@/lib/utils';
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
import { IconRefresh } from '@tabler/icons-react';
import { readContract } from '@wagmi/core';
import { useState } from 'react';
import { toast } from 'sonner';
import { hashMessage, hexToSignature } from 'viem';
import { useContractRead, useWalletClient } from 'wagmi';

interface RefundCardProps {
  contractAddress: string;
  allowVoting: boolean;
  showVote: boolean;
}
export default function RefundCard({
  contractAddress,
  allowVoting,
  showVote,
}: RefundCardProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: walletClient } = useWalletClient();
  const [loading, setSendLoading] = useState(false);
  const [value, setValue] = useState('0');
  const [debounced] = useDebouncedValue(value, 500);

  const { data: funderAmount, refetch } = useContractRead({
    abi: VOTE_ABI,
    address: contractAddress as `0x${string}`,
    functionName: 'funderAmount',
    args: [walletClient?.account.address as `0x${string}`],
  });

  const { data: refundSubmission, refetch: refetchRefundSubmission } = useContractRead({
    abi: VOTE_ABI,
    address: contractAddress as `0x${string}`,
    functionName: 'getSubmissionByHash',
    args: [refundHash() as `0x${string}`],
  });

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

      const hash = refundHash();
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

      await refetch();
      await refetchRefundSubmission();
      setSendLoading(false);
      toast.success(<TransactionToast hash={tx} title="Voted Successfully" />);

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

            <Button onClick={vote} disabled={!value} loading={loading}>
              Vote!
            </Button>
          </Stack>
        </Modal>
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="flex items-center justify-between w-full">
            <Group>
              <Avatar color="blue" radius="md" alt="creator" className="rounded-sm" />
              <div>
                <Text variant="p" fw="bold" my="0px" className="leading-[15px]">
                  Vote for Refund
                </Text>
              </div>
            </Group>
          </div>
          <div>
            <div className="flex gap-1 sm:justify-end items-center ">
              <Button color="black" mr="5px" onClick={open} disabled={!allowVoting}>
                Vote
              </Button>
              {allowVoting && showVote ? (
                <Badge variant="filled" w="auto" size="lg" color="blue">
                  {parseUsdc(refundSubmission ? refundSubmission.usdcVotes : BigInt(0))}{' '}
                  USD
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </>
      <Text lineClamp={4}>
        The amount you vote here is the amount that will be refunded at the end of the
        prize , this will also influence the unused votes
      </Text>
    </Card>
  );
}
