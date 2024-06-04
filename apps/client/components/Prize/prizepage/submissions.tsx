/* eslint-disable react/jsx-no-leaked-render */

import useAppUser from '@/components/hooks/useAppUser';
import { usePrize } from '@/components/hooks/usePrize';
import type { SubmissionWithBlockchainData } from '@/lib/api';
import { Button, Title } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'sonner';
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
  const slug = id?.split('/')[2] as string;

  const { appUser } = useAppUser();
  const { getParticipants, participateInPrize } = usePrize();

  const { data: participants, refetch } = useQuery(
    'participants',
    () => getParticipants(slug),
    {
      refetchInterval: 5000,
    },
  );

  const { mutateAsync: participate } = useMutation(participateInPrize, {
    onSuccess: async () => {
      await refetch();
    },
  });

  const isParticipant = participants?.some(
    (participant) => participant.id === appUser?.id,
  );

  return (
    <div className="w-full flex flex-col gap-3 dont-break-out">
      {allowSubmission &&
        (isParticipant ? (
          <Button
            component="a"
            w="40%"
            className="self-end"
            // target="_blank"
            href={`${id}/editor?contract=${contractAddress}`}
          >
            Submit your work
          </Button>
        ) : (
          <Button
            component="a"
            w="40%"
            className="self-end"
            // target="_blank"
            onClick={() =>
              toast.promise(participate(slug), {
                loading: 'Adding you to the participants list...',
                success: 'You are now a participant',
                error: (e) => `Error participating${e.message}`,
              })
            }
          >
            Participate
          </Button>
        ))}
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
