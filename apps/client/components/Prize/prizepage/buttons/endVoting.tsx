import {
  usePreparePrizeEndVotingPeriod,
  usePrizeEndVotingPeriod,
} from '@/lib/smartContract';
import { Button } from '@mantine/core';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

export default function EndVoting({ contractAddress }: { contractAddress: string }) {
  const { address } = useAccount();
  const { config } = usePreparePrizeEndVotingPeriod({
    account: address,
    address: contractAddress as `0x${string}`,
  });
  const { writeAsync, isLoading } = usePrizeEndVotingPeriod({
    ...config,
    onError(error) {
      toast.error(`Failed With Error ${error.name}`);
    },
  });
  return (
    <Button
      my="md"
      fullWidth
      loading={isLoading}
      onClick={async () => {
        const result = await writeAsync?.();
        toast.success('Rewards Distributed!!!!!', {
          duration: 7000,
        });
        console.log(result);
        window.location.reload();
      }}
    >
      {' '}
      End Voting
    </Button>
  );
}
