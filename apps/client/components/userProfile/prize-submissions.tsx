import SkeletonLoad from '@/components/custom/skeleton-load-explore';
import { backendApi } from '@/lib/backend';
import { useQuery } from 'wagmi';
import SubmissionsCard from '../Prize/prizepage/submissionsCard';

export default function ProfilePrizeSubmission({ params }: { params: { id: string } }) {
  const { isLoading, data } = useQuery(['getSubmissionsOfUser', undefined], async () => {
    return (await backendApi()).users.usernameSubmissionsDetail(params.id);
  });

  if (isLoading) return <SkeletonLoad numberOfCards={2} />;

  if (!data || data.data.length === 0) return <div>No Submissions</div>;

  return (
    <div className="w-full flex justify-center items-center">
      {data.data.map((submission) => (
        <SubmissionsCard
          allowVoting={false}
          contractAddress=""
          description={submission.submissionDescription}
          fullname=""
          hash={submission.submissionHash}
          showVote={false}
          votes={0}
          submissionId={submission.id}
          time=""
          wallet={submission.submitterAddress}
          key={submission.id}
        />
      ))}
    </div>
  );
}
