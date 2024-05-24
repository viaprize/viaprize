import { prepareWritePrize, writePrize } from '@/lib/smartContract';
import { Button, Modal, NumberInput, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCircleCheck } from '@tabler/icons-react';
import { waitForTransaction } from '@wagmi/core';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

export default function ChangeVoting({
  contractAddress,
  votingTime,
}: {
  contractAddress: string;
  votingTime: number;
}) {
  console.log({ votingTime }, 'voting time ');
  const { address } = useAccount();

  const [opened, { open, close }] = useDisclosure(false);

  const [newVotingTime, setnewVotingTime] = useState(0);

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Increase Submission Time" centered>
        <NumberInput
          value={newVotingTime}
          allowDecimal={false}
          allowNegative={false}
          onChange={(event) => {
            setnewVotingTime(parseInt(event.toString()));
          }}
          placeholder="Enter in %"
          description={`This will increase voting time by ${newVotingTime} days from ${new Date(votingTime * 1000)}`}
        />

        <Button
          onClick={async () => {
            try {
              toast.loading('Loading.....');
              setLoading(true);

              const request = await prepareWritePrize({
                address: contractAddress as `0x${string}`,
                functionName: 'increase_voting_period',
                args: [BigInt(parseInt(newVotingTime.toString()))],
              });
              const { hash } = await writePrize(request);

              const waitTransaction = await waitForTransaction({
                confirmations: 1,
                hash,
              });
              toast.success(
                <div className="flex items-center ">
                  <IconCircleCheck />{' '}
                  <Text fw="md" size="sm" className="ml-2">
                    {' '}
                    Voting Period Started
                  </Text>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://optimistic.etherscan.io/tx/${hash}`}
                  >
                    <Button variant="transparent" className="text-blue-400 underline">
                      See here
                    </Button>
                  </Link>
                </div>,
              );
              console.log({ hash }, 'hash');
              window.location.reload();
            } catch (error) {
              toast.error(`Failed With Error ${error}`);
            } finally {
              setLoading(false);
            }
          }}
          loading={loading}
        >
          {' '}
          Confirm
        </Button>
      </Modal>
      <Button
        my="md"
        fullWidth
        loading={loading}
        onClick={async () => {
          //   setIsLoading(true);
          //   try {
          //     const request = await prepareWritePrize({
          //       address: contractAddress as `0x${string}`,
          //       account: address,
          //       functionName: 'start_voting_period',
          //       args: [BigInt(votingTime)],
          //     });
          //     const { hash } = await writePrize(request);

          //     const waitTransaction = await waitForTransaction({
          //       confirmations: 1,
          //       hash,
          //     });
          //     toast.success(`Submission Period Started, Transaction Hash ${hash}`);
          //     console.log({ hash }, 'hash');
          //   } catch (error) {
          //     toast.error(`Failed With Error`);
          //   } finally {
          //     setIsLoading(false);
          //     window.location.reload();
          //   }\
          open();
        }}
      >
        {' '}
        Increase Voting Time
      </Button>
    </>
  );
}
