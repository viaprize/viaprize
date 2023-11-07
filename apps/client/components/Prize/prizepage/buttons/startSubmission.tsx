import {
  usePrepareViaPrizeStartSubmissionPeriod,
  useViaPrizeStartSubmissionPeriod,
} from '@/lib/smartContract';
import { Button } from '@mantine/core';
import { useAccount } from 'wagmi';

export default function StartSubmission({
  contractAddress,
  submissionTime,
}: {
  contractAddress: string;
  submissionTime: number;
}) {
  const { address } = useAccount();
  const { config } = usePrepareViaPrizeStartSubmissionPeriod({
    account: address,
    address: contractAddress as `0x${string}`,
    args: [BigInt(submissionTime)],
  });

  const { writeAsync, isLoading } = useViaPrizeStartSubmissionPeriod({
    ...config,
    onSuccess() {
      window.location.reload();
    },
  });
  return (
    <Button
      fullWidth
      loading={isLoading}
      onClick={async () => {
        const result = await writeAsync?.();
        console.log(result);
      }}
    >
      {' '}
      Start Submission
    </Button>
  );
}
