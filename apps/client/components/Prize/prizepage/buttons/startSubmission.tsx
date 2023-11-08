import {
  prepareWriteViaPrize,
  usePrepareViaPrizeStartSubmissionPeriod,
  useViaPrizeStartSubmissionPeriod,
  writeViaPrize,
} from '@/lib/smartContract';
import { Button } from '@mantine/core';
import { waitForTransaction } from '@wagmi/core';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

export default function StartSubmission({
  contractAddress,
  submissionTime,
}: {
  contractAddress: string;
  submissionTime: number;
}) {
  console.log({ submissionTime }, 'submission time ');
  const { address } = useAccount();
  const { config } = usePrepareViaPrizeStartSubmissionPeriod({
    account: address,
    address: contractAddress as `0x${string}`,
    args: [BigInt(submissionTime)],
  });
  console.log({ config }, 'wtfff');

  const { writeAsync, isLoading } = useViaPrizeStartSubmissionPeriod({
    ...config,
    onSuccess() {
      window.location.reload();
    },
  });
  return (
    <Button
      my="md"
      fullWidth
      loading={isLoading}
      onClick={async () => {
        const request = await prepareWriteViaPrize({
          address: contractAddress as `0x${string}`,
          account: address,
          functionName: 'start_submission_period',
          args: [BigInt(submissionTime)],
        });
        const { hash } = await writeViaPrize(request);

        const waitTransaction = await waitForTransaction({
          confirmations: 1,
          hash,
        });
        toast.success(`Submission Period Started, Transaction Hash ${hash}`);
        console.log({ hash }, 'hash');
        window.location.reload();
        // const result = await writeAsync?.();
        // console.log(result);
      }}
    >
      {' '}
      Start Submission
    </Button>
  );
}
