import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';
import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import revalidate from 'utils/revalidate';
export default function EndSubmission({
  contractAddress,
  slug,
}: {
  contractAddress: string;
  slug: string;
}) {
  const router = useRouter();
  const { mutateAsync, isLoading } = useMutation(
    async () => {
      return await (await backendApi()).wallet.prizeEndSubmissionCreate(contractAddress);
    },
    {
      onSuccess: async (data) => {
        toast.success(
          <TransactionToast title="Submission Ending" hash={data.data.hash} />,
        );

        await revalidate({ tag: slug });
        router.refresh();
      },
    },
  );
  return (
    <Button
      fullWidth
      my="md"
      loading={isLoading}
      onClick={async () => {
        const result = await mutateAsync?.();
        console.log(result);
      }}
    >
      {' '}
      End Submission
    </Button>
  );
}
