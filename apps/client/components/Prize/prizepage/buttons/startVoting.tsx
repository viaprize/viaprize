import { useViaPrizeStartVotingPeriod } from '@/lib/smartContract';
import { Button } from '@mantine/core';
import { useAccount } from 'wagmi';

export default function StartVoting({
  contractAddress,
  votingTime,
}: {
  contractAddress: string;
  votingTime: number;
}) {
  const { address } = useAccount();
  // const { config } = usePrepareViaPrizeStartVotingPeriod({
  //     account: address,
  //     address: contractAddress as `0x${string}`,
  //     args: [BigInt(votingTime)]
  // });
  const { writeAsync, isLoading } = useViaPrizeStartVotingPeriod({
    account: address,
    address: contractAddress as `0x${string}`,
    args: [BigInt(votingTime)],
    onSuccess(data) {
      console.log({ data });
      window.location.reload();
    },
  });
  return (
    <Button
      my="md"
      fullWidth
      loading={isLoading}
      onClick={async () => {
        const result = await writeAsync?.();
        console.log(result);
      }}
    >
      {' '}
      Start Voting
    </Button>
  );
}
