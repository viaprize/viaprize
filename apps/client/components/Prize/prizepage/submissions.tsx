import { SubmissionWithBlockchainData } from '@/lib/api';
import { Button, Title } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
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
    <div className="w-full flex flex-col gap-3">
      {allowSubmission && (
        <Button
          component="a"
          w="40%"
          className="self-end"
          target="_blank"
          href={`/prize/${id as string}/editor?contract=${contractAddress}`}
        >
          Submit your work
        </Button>
      )}
      <Title order={3} style={{ textAlign: 'left' }}>
        Submissions
      </Title>
      {submissions.map((submission: SubmissionWithBlockchainData) => (
        <SubmissionsCard
          fullname={submission.user.name}
          contractAddress={contractAddress}
          hash={submission.submissionHash}
          showVote={true}
          wallet={submission.submitterAddress}
          time={''}
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
