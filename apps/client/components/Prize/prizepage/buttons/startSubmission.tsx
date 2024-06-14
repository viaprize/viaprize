import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';
import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import revalidate from 'utils/revalidate';

export default function StartSubmission({
  contractAddress,
  submissionTime,
  slug,
}: {
  contractAddress: string;
  submissionTime: number;
  slug: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
          window.location.reload();
          console.log({ hash }, 'hash');
        } catch (error) {
          toast.error(`Failed With Error` + (error as Error).message);
        } finally {
          await revalidate({ tag: slug });
          router.refresh();
          setIsLoading(false);
        }
      }}
    >
      {' '}
      Start Submission
    </Button>
  );
}
