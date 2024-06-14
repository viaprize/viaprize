import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';

import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import revalidate from 'utils/revalidate';

export default function EndVoting({
  contractAddress,
  slug,
}: {
  contractAddress: string;
  slug: string;
}) {
  const router = useRouter();
  const { mutateAsync, isLoading } = useMutation(
    async () => {
      return await (await backendApi()).wallet.prizeEndVotingCreate(contractAddress);
    },
    {
      onSuccess: async (data) => {
        await revalidate({ tag: slug });
        router.refresh();
        toast.success(<TransactionToast title="Voting Ending" hash={data.data.hash} />);
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
      End Voting
    </Button>
  );
}
