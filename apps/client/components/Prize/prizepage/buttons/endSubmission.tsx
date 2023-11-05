import {
  usePrepareViaPrizeEndSubmissionPeriod,
  useViaPrizeEndSubmissionPeriod,
} from '@/lib/smartContract';
import { Button } from '@mantine/core';
import { useAccount } from 'wagmi';

export default function EndSubmission({ contractAddress }: { contractAddress: string }) {
  const { address } = useAccount();
  const { config } = usePrepareViaPrizeEndSubmissionPeriod({
    account: address,
    address: contractAddress as `0x${string}`,
  });
  const { writeAsync, isLoading } = useViaPrizeEndSubmissionPeriod(config);
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
      End Submission
    </Button>
  );
}
