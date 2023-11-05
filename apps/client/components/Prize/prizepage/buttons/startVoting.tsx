import {
  usePrepareViaPrizeStartVotingPeriod,
  useViaPrizeStartVotingPeriod,
} from '@/lib/smartContract';
import { Button } from '@mantine/core';
import { useAccount } from 'wagmi';

export default function StartVoting({ contractAddress }: { contractAddress: string }) {
  const { address } = useAccount();
  const { config } = usePrepareViaPrizeStartVotingPeriod({
    account: address,
    address: contractAddress as `0x${string}`,
  });
  const { writeAsync, isLoading } = useViaPrizeStartVotingPeriod(config);
  return (
    <Button
      fullWidth
      loading={isLoading}
      onClick={async () => {
        const result = await writeAsync?.();
        console.log(result);
        window.location.reload();
      }}
    >
      {' '}
      Start Voting
    </Button>
  );
}
