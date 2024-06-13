import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';
import { Button } from '@mantine/core';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

export default function StartVoting({
  contractAddress,
}: {
  contractAddress: string;
  votingTime: number;
}) {
  const { mutateAsync, isLoading } = useMutation(
    async () => {
      return await (await backendApi()).wallet.prizeStartVotingCreate(contractAddress);
    },
    {
      onSuccess: async (data) => {
        console.log(data);
        toast.success(
          <TransactionToast hash={data.data.hash} title="Voting Period Started" />,
        );
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
        console.log(result);
      }}
    >
      {' '}
      Start Voting
    </Button>
  );
}
