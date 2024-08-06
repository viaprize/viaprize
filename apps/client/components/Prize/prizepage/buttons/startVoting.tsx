import { TransactionToast } from '@/components/custom/transaction-toast';
import { backendApi } from '@/lib/backend';
import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import revalidate from 'utils/revalidate';

export default function StartVoting({
  contractAddress,
  slug,
}: {
  contractAddress: string;
  votingTime: number;
  slug: string;
}) {
  const router = useRouter();
  const { mutateAsync, isLoading } = useMutation(
    async () => {
      return await (await backendApi()).wallet.prizeStartVotingCreate(contractAddress);
    },
    {
      onSuccess: async (data) => {
        await revalidate({ tag: slug });

        console.log(data);

        toast.success(
          <TransactionToast hash={data.data.hash} title="Voting Period Started" />,
        );
        router.refresh();
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
        const result = await mutateAsync?.().catch((e) => {
          console.log(e);
          toast.error(e?.error.message);
        });
        console.log(result);
      }}
    >
      {' '}
      Start Voting
    </Button>
  );
}
