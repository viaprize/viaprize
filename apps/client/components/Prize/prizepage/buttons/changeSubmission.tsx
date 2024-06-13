import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';
import { Button, Modal, NumberInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ChangeSubmission({
  contractAddress,
  submissionTime,
}: {
  contractAddress: string;
  submissionTime: number;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const [newSubmissionTime, setnewSubmissionTime] = useState(0);

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
          //       functionName: 'start_submission_period',
          //       args: [BigInt(submissionTime)],
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
        Increase Submission Time
      </Button>
    </>
  );
}
