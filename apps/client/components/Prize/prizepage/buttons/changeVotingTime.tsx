import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';
import { Button, Modal, NumberInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import revalidate from 'utils/revalidate';

export default function ChangeVotingTime({
  contractAddress,
  votingTime,
  slug,
}: {
  contractAddress: string;
  votingTime: number;
  slug: string;
}) {
  console.log({ votingTime }, 'voting time ');

  const [opened, { open, close }] = useDisclosure(false);

  const [newVotingTime, setnewVotingTime] = useState(0);

  const router = useRouter();
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
                <TransactionToast title=" Voting Period Changed" hash={hash} />,
              );
              console.log({ hash }, 'hash');
            } catch (error) {
              toast.error(`Failed With Error ${error}`);
            } finally {
              await revalidate({ tag: slug });
              router.refresh();
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
