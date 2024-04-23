import type { SubmissionWithBlockchainData } from '@/lib/api';
import { Button, Title } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { formatEther } from 'viem';
import SubmissionsCard from './submissionsCard';

export default function Submissions({
  contractAddress,
  submissions,
  allowSubmission,
  allowVoting,
}: {
  contractAddress: string;
  submissions: SubmissionWithBlockchainData[];
  allowSubmission: boolean;
  allowVoting: boolean;
}) {
  const id = usePathname();

  return (
    <div className="w-full flex flex-col gap-3 dont-break-out">
      {allowSubmission ? (
        <Button
          component="a"
          w="40%"
          className="self-end"
          // target="_blank"
          href={`${id!}/editor?contract=${contractAddress}`}
        >
          Submit your work
        </Button>
      ) : null}
      <Title order={3} style={{ textAlign: 'left' }}>
        Submissions
      </Title>
      {submissions.map((submission: SubmissionWithBlockchainData) => (
        <SubmissionsCard
          fullname={submission.user.name}
          contractAddress={contractAddress}
          hash={submission.submissionHash}
          showVote
          won={`won ${parseFloat(formatEther(BigInt(submission.voting_blockchain)))} eth`}
          wallet={submission.submitterAddress}
          time=""
          votes={submission.voting_blockchain}
          submissionId={submission.id}
          key={submission.id}
          description={submission.submissionDescription}
          allowVoting={allowVoting}
        />
      ))}
    </div>
  );
}
