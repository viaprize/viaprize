import {
  usePrepareViaPrizeStartSubmissionPeriod,
  useViaPrizeStartSubmissionPeriod,
} from '@/lib/smartContract';
import { Button } from '@mantine/core';
import { useAccount } from 'wagmi';

export default function StartSubmission({
  contractAddress,
}: {
  contractAddress: string;
}) {
  const { address } = useAccount();
  const { config } = usePrepareViaPrizeStartSubmissionPeriod({
    account: address,
    address: contractAddress as `0x${string}`,
  });
  const { writeAsync, isLoading } = useViaPrizeStartSubmissionPeriod(config);
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
      Start Submission
    </Button>
  );
}
