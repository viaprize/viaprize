import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';
import { Button } from '@mantine/core';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

export default function EndDispute({
  contractAddress,
  slug,
}: {
  contractAddress: string;
  slug: string;
}) {
  const { mutateAsync, isLoading } = useMutation(
    async () => {
      return await (await backendApi()).wallet.prizeEndDisputeCreate(contractAddress);
    },
    {
      onSuccess: async (data) => {
        toast.success(<TransactionToast title="Dispute Ending" hash={data.data.hash} />);
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
      End Dispute
    </Button>
  );
}
