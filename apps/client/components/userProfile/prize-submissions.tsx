import SkeletonLoad from '@/components/custom/skeleton-load-explore';
import { backendApi } from '@/lib/backend';
import { useQuery } from 'wagmi';
import SubmissionsCard from '../Prize/prizepage/submissionsCard';
import Shell from '../custom/shell';

export default function ProfilePrizeSubmission({ params }: { params: { id: string } }) {
  const { isLoading, data } = useQuery(['getSubmissionsOfUser'], async () => {
    return (await backendApi()).users.usernameSubmissionsDetail(params.id);
  });

  if (isLoading) return <SkeletonLoad numberOfCards={2} gridedSkeleton />;

  if (!data || data.data.length === 0)
    return <Shell>You dont have any Submissions</Shell>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {data.data.map((submission) => (
        <SubmissionsCard
          username=""
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
          prize={submission.prize}
        />
      ))}
    </div>
  );
}
