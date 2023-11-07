import {
  prepareWriteViaPrize,
  useViaPrizeFunders,
  writeViaPrize,
} from '@/lib/smartContract';
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  TypographyStylesProvider,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { IconArrowAutofitUp, IconRefresh } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';
import { useAccount } from 'wagmi';

interface SubmissionsCardProps {
  fullname: string;
  submission: string;
  wallet: string;
  time: string;
  votes: number;
  onUpVote?: () => void;
  submissionId: string;
  contractAddress: string;
  hash: string;
  description: string;
}
export default function SubmissionsCard({
  fullname,
  votes,
  wallet,
  time,
  contractAddress,
  hash,
  description,
}: SubmissionsCardProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { address } = useAccount();
  const [sendLoading, setSendLoading] = useState(false);
  const [value, setValue] = useState('0');
  const [debounced] = useDebouncedValue(value, 500);
  const {
    data: funderBalance,
    refetch,
    isLoading,
  } = useViaPrizeFunders({
    address: contractAddress as `0x${string}`,
    args: [address ?? '0x'],
  });
  // const { config } = usePrepareViaPrizeVote({});
  // console.log({ config });
  // console.log([hash as `0x${string}`, parseEther(debounced)], 'hiiii');

  // console.log({ debounced }, 'debounced');
  // const {
  //   isLoading: sendLoading,
  //   writeAsync,
  //   write,
  // } = useViaPrizeVote({
  //   address: contractAddress as `0x${string}`,
  //   account: address,
  //   args: [hash as `0x${string}`, parseEther(debounced)],

  //   onSuccess(data) {
  //     toast.success(`Transaction Sent with Hash ${data?.hash}`, {
  //       duration: 6000,
  //     });
  //   },
  // });

  return (
    <Card className="flex flex-col justify-center gap-3">
      <Modal opened={opened} onClose={close} title="Voting For this submission">
        <Stack>
          <NumberInput
            label={
              isLoading
                ? 'Loading.....'
                : `Total Votes you can allocate(Max: ${formatEther(
                    BigInt(funderBalance?.toString() ?? '0'),
                  )} Matic )`
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

          <Button
            onClick={async () => {
              setSendLoading(true);

              const { request } = await prepareWriteViaPrize({
                address: contractAddress as `0x${string}`,
                functionName: 'vote',
                args: [hash as `0x${string}`, parseEther(debounced)],
              });

              const { hash: transactionHash } = await writeViaPrize(request);

              console.log({ transactionHash }, 'transactionHash');

              toast.success(`Transaction Sent with Hash ${transactionHash}`);

              setSendLoading(false);

              close();
            }}
            disabled={!value}
            loading={sendLoading}
          >
            Vote!
          </Button>
        </Stack>
      </Modal>
      <div className="flex justify-between items-center">
        <Group>
          <Avatar color="blue" radius="md" alt="creator" className="rounded-sm" />
          <div>
            <Text variant="p" fw="bold" my="0px" className="leading-[15px]">
              {fullname}
            </Text>
            {/* <Text variant="p" fw="bold" my="0px" className="leading-[15px]">
            Proposer Email: {email}
          </Text> */}
            <Text c="dimmed" fz="sm">
              {wallet}
            </Text>
          </div>
        </Group>
        <Group>
          <Text c="dimmed" fz="sm">
            {time}
          </Text>
          <Group justify="right" gap="0" wrap="nowrap">
            <Button color="black" mx="5px" onClick={open}>
              vote
            </Button>
            <ActionIcon variant="filled" size="lg" color="blue">
              <Text>{votes}</Text>
            </ActionIcon>
          </Group>
        </Group>
      </div>
      <Text lineClamp={3} component="div">
        <TypographyStylesProvider>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </TypographyStylesProvider>
      </Text>
      <Button rightSection={<IconArrowAutofitUp size="1rem" />}>View Submission</Button>
    </Card>
  );
}
