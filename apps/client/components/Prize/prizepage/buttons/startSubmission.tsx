import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';
import { Button } from '@mantine/core';
import { useState } from 'react';
import { toast } from 'sonner';

export default function StartSubmission({
  contractAddress,
  submissionTime,
}: {
  contractAddress: string;
  submissionTime: number;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      my="md"
      fullWidth
      loading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          const hash = (
            await (await backendApi()).wallet.prizeStartSubmissionCreate(contractAddress)
          ).data;
          toast.success(
            <TransactionToast hash={hash.hash} title=" Submission Period Started" />,
          );
          console.log({ hash }, 'hash');
        } catch (error) {
          toast.error(`Failed With Error` + (error as Error).message);
        } finally {
          setIsLoading(false);
          window.location.reload();
        }
      }}
    >
      {' '}
      Start Submission
    </Button>
  );
}
