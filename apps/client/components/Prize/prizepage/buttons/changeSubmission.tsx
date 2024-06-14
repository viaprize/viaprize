import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';
import { Button, Modal, NumberInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import revalidate from 'utils/revalidate';

export default function ChangeSubmission({
  contractAddress,
  submissionTime,
  slug,
}: {
  contractAddress: string;
  submissionTime: number;
  slug: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const [newSubmissionTime, setnewSubmissionTime] = useState(0);

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Increase Submission Time" centered>
        <NumberInput
          value={newSubmissionTime}
          allowDecimal={false}
          allowNegative={false}
          onChange={(event) => {
            setnewSubmissionTime(parseInt(event.toString()));
          }}
          placeholder="Enter in %"
          description={`This will increase submission time by ${newSubmissionTime} minutes from ${new Date()}`}
        />

        <Button
          onClick={async () => {
            try {
              setLoading(true);
              toast.loading('Loading.....');

              const { hash } = await (
                await backendApi()
              ).wallet
                .prizeIncreaseSubmissionCreate(contractAddress, {
                  minutes: newSubmissionTime,
                })
                .then((res) => res.data);
              toast.success(
                <TransactionToast title=" Submission Period Changed" hash={hash} />,
              );
              console.log({ hash }, 'hash');
              await revalidate({ tag: slug });
              router.refresh();
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
        Increase Submission Time
      </Button>
    </>
  );
}
