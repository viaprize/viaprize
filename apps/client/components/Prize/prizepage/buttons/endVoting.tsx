import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';

import { Button } from '@mantine/core';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

export default function EndVoting({ contractAddress }: { contractAddress: string }) {
  const { mutateAsync, isLoading } = useMutation(
    async () => {
      return await (await backendApi()).wallet.prizeEndVotingCreate(contractAddress);
    },
    {
      onSuccess: async (data) => {
        toast.success(<TransactionToast title="Voting Ending" hash={data.data.hash} />);
        window.location.reload();
      },
    },
  );
  return (
    <Button
      my="md"
      fullWidth
      loading={isLoading}
      onClick={async () => {
        const result = await mutateAsync?.();
      }}
    >
      {' '}
      End Voting
    </Button>
  );
}
