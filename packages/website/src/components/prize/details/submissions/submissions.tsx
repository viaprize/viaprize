import { Separator } from '@viaprize/ui/separator';
import SubmissionCard from './submission-card';

interface Submission {
  description: string;
  username: string | null;
  prizeId: string | null;
  submissionHash: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  submitterAddress: string;
}

interface SubmissionsProps {
  submissions: Submission[];
}

export default function Submissions({ submissions }: SubmissionsProps) {
  return (
    <div className="p-3">
      <div className="text-xl">Submissions ({submissions.length})</div>
      <Separator className="my-2" />
      {submissions.map((submission) => {
        const formattedDate = (submission.createdAt ?? new Date()).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return (
          <SubmissionCard
            key={submission.username}
            description={submission.description}
            name={submission.username ?? ''}
            submissionCreated={formattedDate}
          />
        );
      })}
    </div>
  );
}
