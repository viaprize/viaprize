import { backendApi } from '@/lib/backend';
import { Button, Modal, NumberInput, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCircleCheck } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ChangeVoting({
  contractAddress,
  votingTime,
}: {
  contractAddress: string;
  votingTime: number;
}) {
  console.log({ votingTime }, 'voting time ');

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
          placeholder="Enter in minutes"
          description={`This will increase voting time by ${newVotingTime} minutes from ${new Date()}`}
        />

        <Button
          onClick={async () => {
            try {
              toast.loading('Loading.....');
              setLoading(true);

              const { hash } = await (
                await backendApi()
              ).wallet
                .prizeIncreaseVotingCreate(contractAddress, {
                  minutes: newVotingTime,
                })
                .then((res) => res.data);
              toast.success(
                <div className="flex items-center ">
                  <IconCircleCheck />{' '}
                  <Text fw="md" size="sm" className="ml-2">
                    {' '}
                    Voting Period Changed
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
          open();
        }}
      >
        {' '}
        Increase Voting Time
      </Button>
    </>
  );
}
