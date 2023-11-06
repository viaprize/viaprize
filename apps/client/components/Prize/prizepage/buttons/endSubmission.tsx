import { useViaPrizeEndSubmissionPeriod } from '@/lib/smartContract';
import { Button } from '@mantine/core';
import { useAccount } from 'wagmi';

export default function EndSubmission({ contractAddress }: { contractAddress: string }) {
  const { address } = useAccount();
  // const { config } = usePrepareViaPrizeEndSubmissionPeriod({

  // });
  const { writeAsync, isLoading } = useViaPrizeEndSubmissionPeriod({
    account: address,
    address: contractAddress as `0x${string}`,
    onSuccess(data, variables, context) {
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
      End Submission
    </Button>
  );
}
