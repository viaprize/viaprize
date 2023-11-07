import {
  usePrepareViaPrizeEndVotingPeriod,
  useViaPrizeEndVotingPeriod,
} from '@/lib/smartContract';
import { Button } from '@mantine/core';
import { useAccount } from 'wagmi';

export default function EndVoting({ contractAddress }: { contractAddress: string }) {
  const { address } = useAccount();
  const { config } = usePrepareViaPrizeEndVotingPeriod({
    account: address,
    address: contractAddress as `0x${string}`,
  });
  const { writeAsync, isLoading } = useViaPrizeEndVotingPeriod(config);
  return (
    <Button
      my="md"
      fullWidth
      loading={isLoading}
      onClick={async () => {
        const result = await writeAsync?.();
        console.log(result);
        window.location.reload();
      }}
    >
      {' '}
      End Voting
    </Button>
  );
}
